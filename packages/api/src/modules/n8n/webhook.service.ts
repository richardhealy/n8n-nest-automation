import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import type { WebhookDto } from './dto/webhook.dto';
import type { Prisma } from '@prisma/client';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async handleWebhook(webhookDto: WebhookDto) {
    this.logger.log(
      `Processing webhook for workflow: ${webhookDto.workflowId}`,
    );

    await this.prisma.webhookEvent.create({
      data: {
        workflowId: webhookDto.workflowId,
        payload: webhookDto.payload as unknown as Prisma.InputJsonValue,
        event: webhookDto.event,
      },
    });

    // Process webhook based on event type
    switch (webhookDto.event) {
      case 'workflow.completed':
        return this.handleWorkflowCompletion(webhookDto);
      case 'workflow.error':
        return this.handleWorkflowError(webhookDto);
      default:
        return this.handleGenericWebhook(webhookDto);
    }
  }

  private async handleWorkflowCompletion(webhookDto: WebhookDto) {
    // Implement workflow completion logic
    return { status: 'success', message: 'Webhook processed' };
  }

  private async handleWorkflowError(webhookDto: WebhookDto) {
    // Implement error handling logic
    this.logger.error(`Workflow error: ${JSON.stringify(webhookDto.payload)}`);
    return { status: 'error', message: 'Error processed' };
  }

  private async handleGenericWebhook(webhookDto: WebhookDto) {
    // Handle other webhook types
    return { status: 'success', message: 'Generic webhook processed' };
  }
}
