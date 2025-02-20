import { IsString, IsArray, IsObject, IsOptional, IsNotEmpty } from 'class-validator';
import { WorkflowConfig } from '../types/workflow.types';

export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  name: string = '';

  @IsString()
  @IsNotEmpty()
  description: string = '';

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
  organizationId: string = '';
} 