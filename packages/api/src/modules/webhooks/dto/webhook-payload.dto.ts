import { IsString, IsObject, IsNotEmpty } from 'class-validator';

export class WebhookPayloadDto {
	@IsString()
	@IsNotEmpty()
	workflowId = '';

	@IsString()
	@IsNotEmpty()
	organizationId = '';

	@IsObject()
	@IsNotEmpty()
	data: Record<string, any> = {};
}
