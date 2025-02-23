import type { WorkflowData } from './workflow.types';

export interface WorkflowExecutionHistory {
	id: string;
	workflowId: string;
	status: WorkflowExecutionStatus;
	startTime: Date;
	endTime: Date;
	executionData: WorkflowData;
	errorMessage?: string;
	createdAt: Date;
}

export enum WorkflowExecutionStatus {
	PENDING = 'PENDING',
	RUNNING = 'RUNNING',
	COMPLETED = 'COMPLETED',
	FAILED = 'FAILED',
	CANCELLED = 'CANCELLED',
}

export interface WorkflowSchedule {
	id: string;
	workflowId: string;
	cron: string;
	enabled: boolean;
	isActive: boolean;
	lastRun?: Date;
	nextRun?: Date;
	timezone: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface WorkflowTemplate {
	id: string;
	name: string;
	description: string;
	category: string;
	tags: string[];
	templateData: WorkflowData;
	version: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface WorkflowVersion {
	id: string;
	workflowId: string;
	version: string;
	changes: string;
	workflowData: WorkflowData;
	createdBy: string;
	createdAt: Date;
}
