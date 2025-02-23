import {
	IsString,
	IsOptional,
	IsArray,
	IsObject,
	ValidateNested,
	IsBoolean,
	IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class WorkflowNode {
	@IsString()
	id = '';

	@IsString()
	name = '';

	@IsString()
	type = '';

	@IsObject()
	parameters: Record<string, any> = {};

	@IsObject()
	position: {
		x: number;
		y: number;
	} = { x: 0, y: 0 };
}

class WorkflowConnections {
	@IsString()
	node = '';

	@IsString()
	type = '';

	@IsArray()
	items: Array<{
		node: string;
		type: string;
		index: number;
	}> = [];
}

class WorkflowSettings {
	@IsBoolean()
	@IsOptional()
	saveExecutionProgress?: boolean = true;

	@IsBoolean()
	@IsOptional()
	saveManualExecutions?: boolean = true;

	@IsString()
	@IsOptional()
	saveDataErrorExecution?: string = 'all';

	@IsString()
	@IsOptional()
	saveDataSuccessExecution?: string = 'all';

	@IsNumber()
	@IsOptional()
	executionTimeout?: number = 3600;

	@IsString()
	@IsOptional()
	timezone?: string = 'UTC';
}

export class CreateWorkflowDto {
	@IsString()
	name = '';

	@IsOptional()
	@IsString()
	description?: string = '';

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => WorkflowNode)
	nodes: WorkflowNode[] = [];

	@IsObject()
	connections: {
		[key: string]: WorkflowConnections[];
	} = {};

	@IsObject()
	@ValidateNested()
	@Type(() => WorkflowSettings)
	settings: WorkflowSettings = {
		saveExecutionProgress: true,
		saveManualExecutions: true,
		saveDataErrorExecution: 'all',
		saveDataSuccessExecution: 'all',
		executionTimeout: 3600,
		timezone: 'UTC',
	};

	@IsOptional()
	@IsBoolean()
	active?: boolean = false;
}
