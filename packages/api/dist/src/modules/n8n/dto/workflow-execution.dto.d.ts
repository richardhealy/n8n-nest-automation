import { WorkflowExecutionStatus } from '../types/workflow-execution.enum';
export declare class UpdateWorkflowExecutionDto {
    status: WorkflowExecutionStatus;
    error?: string;
    result?: Record<string, any>;
}
