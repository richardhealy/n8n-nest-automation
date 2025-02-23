import { PrismaService } from '../../prisma/prisma.service';
import { WorkflowExecutionHistory, WorkflowSchedule } from '../types/workflow-history.types';
export declare class WorkflowHistoryService {
    private prisma;
    constructor(prisma: PrismaService);
    createExecutionHistory(data: Omit<WorkflowExecutionHistory, 'id' | 'createdAt'>): Promise<WorkflowExecutionHistory>;
    createSchedule(data: Omit<WorkflowSchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkflowSchedule>;
    getWorkflowHistory(workflowId: string): Promise<WorkflowExecutionHistory[]>;
    updateScheduleStatus(scheduleId: string, isActive: boolean): Promise<WorkflowSchedule>;
}
