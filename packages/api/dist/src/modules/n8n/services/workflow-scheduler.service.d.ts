import { OnModuleInit } from '@nestjs/common';
import { WorkflowHistoryService } from './workflow-history.service';
import { N8nService } from '../n8n.service';
import { PrismaService } from '../../prisma/prisma.service';
export declare class WorkflowSchedulerService implements OnModuleInit {
    private readonly historyService;
    private readonly n8nService;
    private readonly prisma;
    private scheduledJobs;
    constructor(historyService: WorkflowHistoryService, n8nService: N8nService, prisma: PrismaService);
    onModuleInit(): Promise<void>;
    private scheduleWorkflow;
    private calculateNextRunDate;
    updateSchedule(scheduleId: string, isActive: boolean): Promise<void>;
}
