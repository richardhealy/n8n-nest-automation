import type { Prisma } from '@prisma/client';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { WorkflowExecutionStatus } from '../types/workflow-execution.enum';

export class UpdateWorkflowExecutionDto {
	@IsString()
	status: WorkflowExecutionStatus = WorkflowExecutionStatus.RUNNING;

	@IsString()
	@IsOptional()
	error?: string = '';

	@IsObject()
	@IsOptional()
	result?: Prisma.InputJsonValue;
}
