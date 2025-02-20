import { IsString, IsObject, IsNotEmpty } from 'class-validator';

export class WebhookPayloadDto {
  @IsString()
  @IsNotEmpty()
  workflowId: string = '';

  @IsString()
  @IsNotEmpty()
  organizationId: string = '';

  @IsObject()
  @IsNotEmpty()
  data: Record<string, any> = {};
} 