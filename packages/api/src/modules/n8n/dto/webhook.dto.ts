import { IsObject, IsOptional, IsString } from 'class-validator';

export class WebhookDto {
  @IsString()
  workflowId = '';

  @IsObject()
  payload: Record<string, unknown> = {};

  @IsString()
  @IsOptional()
  event?: string = '';
}
