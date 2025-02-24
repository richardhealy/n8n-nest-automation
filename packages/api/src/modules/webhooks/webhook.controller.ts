import {
	Body,
	Controller,
	HttpCode,
	HttpException,
	HttpStatus,
	Logger,
	Param,
	Post,
} from '@nestjs/common';
import type { WebhookService } from './webhook.service';

interface WebhookResponse {
	success: boolean;
	data?: unknown;
	error?: string;
	message?: string;
}

@Controller('webhooks')
export class WebhookController {
	private readonly logger = new Logger(WebhookController.name);

	constructor(private readonly webhookService: WebhookService) {}

	@Post(':organizationId/:workflowId')
	@HttpCode(HttpStatus.OK)
	async handleWebhook(
		@Param('organizationId') organizationId: string,
		@Param('workflowId') workflowId: string,
		@Body() payload: Record<string, unknown>,
	): Promise<WebhookResponse> {
		try {
			this.logger.debug(
				`Received webhook for organization ${organizationId}, workflow ${workflowId}`,
			);

			const result = await this.webhookService.processWebhook(
				organizationId,
				workflowId,
				payload,
			);

			return result;
		} catch (error) {
			this.logger.error(
				`Webhook processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
			);

			throw new HttpException(
				{
					success: false,
					message: 'Failed to process webhook',
					error: error instanceof Error ? error.message : 'Unknown error',
				},
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
