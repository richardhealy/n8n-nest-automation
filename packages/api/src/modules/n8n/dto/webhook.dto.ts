import { IsString, IsObject, IsOptional } from 'class-validator';

export class WebhookDto {
	@IsString()
	workflowId = '';

	@IsObject()
	payload: Record<string, any> = {};

	@IsString()
	@IsOptional()
	event?: string = '';
}
