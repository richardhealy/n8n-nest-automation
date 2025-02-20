import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WebhookDto } from './dto/webhook.dto';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(private readonly prisma: PrismaService) {}

  async handleWebhook(webhookDto: WebhookDto) {
    this.logger.log(`Processing webhook for workflow: ${webhookDto.workflowId}`);

    // Record webhook event
    await this.prisma.webhookEvent.create({
      data: {
        workflowId: webhookDto.workflowId,
        payload: webhookDto.payload,
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