import { WorkflowHistoryService } from '../services/workflow-history.service';
import { WorkflowExecutionHistory, WorkflowSchedule } from '../types/workflow-history.types';
export declare class WorkflowHistoryController {
    private readonly workflowHistoryService;
    constructor(workflowHistoryService: WorkflowHistoryService);
    getWorkflowHistory(workflowId: string): Promise<WorkflowExecutionHistory[]>;
    createSchedule(scheduleData: Omit<WorkflowSchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkflowSchedule>;
    updateScheduleStatus(id: string, isActive: boolean): Promise<WorkflowSchedule>;
}
