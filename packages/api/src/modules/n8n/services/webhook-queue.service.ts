import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import type {
  Workflow,
  workflowExecution as WorkflowExecution,
} from '@prisma/client';
import type { Prisma } from '@prisma/client';
import type { Job, Queue } from 'bull';
import type { PrismaService } from '../../prisma/prisma.service';
import type { WorkflowEventsGateway } from '../gateways/workflow-events.gateway';
import type { N8nService } from '../n8n.service';
import { WorkflowExecutionStatus } from '../types/workflow-execution.enum';

interface WebhookPayload {
  workflowId: string;
  event: string;
  data: Record<string, unknown>;
}

type WorkflowExecutionWithWorkflow = WorkflowExecution & {
  workflow: Workflow;
};

@Injectable()
@Processor('webhook-events')
export class WebhookQueueService {
  private readonly logger = new Logger(WebhookQueueService.name);

  constructor(
    @InjectQueue('webhook-events') private webhookQueue: Queue,
    private readonly n8nService: N8nService,
    private readonly prisma: PrismaService,
    private readonly eventsGateway: WorkflowEventsGateway,
  ) {}

  async addToQueue(payload: WebhookPayload) {
    return this.webhookQueue.add('process-webhook', payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000, // 2 seconds
      },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  @Process('process-webhook')
  async processWebhook(job: Job<WebhookPayload>) {
    this.logger.debug(`Processing webhook event ${job.id}`);
    const { workflowId, event, data } = job.data;
    const startTime = Date.now();

    try {
      // Notify queue position
      const queuePosition =
        await this.webhookQueue.getJobCountByTypes('waiting');
      this.eventsGateway.notifyQueueUpdate(
        queuePosition,
        queuePosition + 1,
        workflowId,
      );

      // Create execution record
      const execution = await this.prisma.workflowExecution.create({
        data: {
          workflowId,
          status: WorkflowExecutionStatus.RUNNING,
        },
        include: {
          workflow: true,
        },
      });

      // Notify start progress
      this.eventsGateway.notifyProgress(workflowId, {
        step: 'STARTED',
        percentage: 0,
        message: 'Starting workflow execution',
        timestamp: new Date(),
      });

      // Store webhook event
      await this.prisma.webhookEvent.create({
        data: {
          workflowId,
          event,
          payload: data as unknown as Prisma.InputJsonValue,
        },
      });

      // Notify progress
      this.eventsGateway.notifyProgress(workflowId, {
        step: 'PROCESSING',
        percentage: 50,
        message: 'Processing webhook data',
        timestamp: new Date(),
      });

      // Execute workflow
      await this.n8nService.executeWorkflow(workflowId, data);

      // Calculate metrics
      const executionTime = Date.now() - startTime;
      const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // MB

      // Update execution status
      await this.prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: WorkflowExecutionStatus.COMPLETED,
          finishedAt: new Date(),
        },
      });

      // Notify completion progress
      this.eventsGateway.notifyProgress(workflowId, {
        step: 'COMPLETED',
        percentage: 100,
        message: 'Workflow execution completed',
        timestamp: new Date(),
      });

      // Notify metrics
      this.eventsGateway.notifyWorkflowMetrics(workflowId, {
        executionTime,
        memoryUsage,
        successRate: 100,
        lastExecuted: new Date(),
      });

      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to process webhook: ${error.message}`);
      } else {
        this.logger.error('Failed to process webhook: Unknown error');
      }

      // Create execution record for error tracking
      const execution = await this.prisma.workflowExecution.create({
        data: {
          workflowId,
          status: WorkflowExecutionStatus.FAILED,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        include: {
          workflow: true,
        },
      });

      // Notify error
      if (error instanceof Error) {
        this.handleExecutionError(error, execution);
      }

      // Notify failure progress
      this.eventsGateway.notifyProgress(workflowId, {
        step: 'FAILED',
        percentage: 100,
        message: `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      });

      throw error;
    }
  }

  async getQueueStatus() {
    const [waiting, active, completed, failed] = await Promise.all([
      this.webhookQueue.getWaitingCount(),
      this.webhookQueue.getActiveCount(),
      this.webhookQueue.getCompletedCount(),
      this.webhookQueue.getFailedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
    };
  }

  private handleExecutionError(
    error: Error,
    workflowExecution: WorkflowExecutionWithWorkflow,
  ) {
    try {
      this.eventsGateway.notifyError(workflowExecution.workflow.userId, {
        message: error.message,
        workflowId: workflowExecution.workflowId,
        severity: 'error',
      });
    } catch (err) {
      console.error('Failed to notify error:', err);
    }
  }
}
