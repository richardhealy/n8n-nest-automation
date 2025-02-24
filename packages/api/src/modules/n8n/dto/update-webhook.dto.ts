import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { WebhookMethod } from './create-webhook.dto';

export class UpdateWebhookDto {
	@IsString()
	@IsOptional()
	name?: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsEnum(WebhookMethod)
	@IsOptional()
	method?: WebhookMethod;

	@IsString()
	@IsOptional()
	path?: string;

	@IsObject()
	@IsOptional()
	headers?: Record<string, string>;
}
