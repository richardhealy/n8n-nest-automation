import { IsString, IsObject, IsOptional, IsEnum } from 'class-validator';

export enum WebhookMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export class CreateWebhookDto {
  @IsString()
  name: string = '';

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(WebhookMethod)
  method: WebhookMethod = WebhookMethod.GET;

  @IsString()
  path: string = '';

  @IsObject()
  @IsOptional()
  headers?: Record<string, string> = {};

  @IsString()
  workflowId: string = '';
} 