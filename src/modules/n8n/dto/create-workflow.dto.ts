import { IsString, IsObject, IsOptional } from 'class-validator';

export class CreateWorkflowDto {
  @IsString()
  name: string = '';

  @IsString()
  @IsOptional()
  description?: string = '';

  @IsObject()
  config: Record<string, any> = {
    nodes: [],
    connections: [],
    settings: {}
  };
} 