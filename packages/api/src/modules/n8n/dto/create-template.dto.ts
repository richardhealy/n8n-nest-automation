import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';
import type { WorkflowConfig } from '../types/workflow.types';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  name = '';

  @IsString()
  @IsNotEmpty()
  description = '';

  @IsArray()
  @IsString({ each: true })
  tags: string[] = [];

  @IsObject()
  @IsNotEmpty()
  config: WorkflowConfig = {
    nodes: [],
    connections: {},
  };

  @IsString()
  @IsNotEmpty()
  organizationId = '';
}
