import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export enum WebhookMethod {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	PATCH = 'PATCH',
	DELETE = 'DELETE',
}

export class CreateWebhookDto {
	@IsString()
	name = '';

	@IsString()
	@IsOptional()
	description?: string;

	@IsEnum(WebhookMethod)
	method: WebhookMethod = WebhookMethod.GET;

	@IsString()
	path = '';

	@IsObject()
	@IsOptional()
	headers?: Record<string, string> = {};

	@IsString()
	workflowId = '';
}
