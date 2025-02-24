import {
	Body,
	Controller,
	Get,
	Headers,
	Logger,
	NotFoundException,
	Param,
	Post,
	UnauthorizedException,
} from '@nestjs/common';
import type { PrismaService } from '../../prisma/prisma.service';
import type { WebhookQueueService } from '../services/webhook-queue.service';

@Controller('webhooks')
export class WebhookController {
	private readonly logger = new Logger(WebhookController.name);

	constructor(
		private readonly webhookQueue: WebhookQueueService,
		private readonly prisma: PrismaService,
	) {}

	@Post(':token')
	async handleWebhook(
		@Param('token') token: string,
		@Headers() headers: Record<string, string>,
		@Body() payload: Record<string, unknown>,
	) {
		this.logger.debug(`Received webhook event for token: ${token}`);

		// Find webhook configuration by token
		const webhook = await this.prisma.webhookEvent.findFirst({
			where: {
				payload: {
					path: ['token'],
					equals: token,
				},
			},
			include: {
				workflow: true,
			},
		});

		if (!webhook) {
			throw new NotFoundException('Webhook not found');
		}

		if (!webhook.workflow.active) {
			throw new UnauthorizedException('Workflow is not active');
		}

		// Add event to queue
		await this.webhookQueue.addToQueue({
			workflowId: webhook.workflowId,
			event: headers['x-webhook-event'] || 'default',
			data: {
				headers,
				body: payload,
				timestamp: new Date().toISOString(),
			},
		});

		return { success: true };
	}

	@Get('queue/status')
	async getQueueStatus() {
		return this.webhookQueue.getQueueStatus();
	}
}
