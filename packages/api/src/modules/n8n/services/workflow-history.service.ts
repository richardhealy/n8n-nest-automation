import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import type { PrismaService } from '../../prisma/prisma.service';
import type {
  WorkflowExecutionHistory,
  WorkflowSchedule,
} from '../types/workflow-history.types';

@Injectable()
export class WorkflowHistoryService {
  constructor(private prisma: PrismaService) {}

  async createExecutionHistory(
    data: Omit<WorkflowExecutionHistory, 'id' | 'createdAt'>,
  ): Promise<WorkflowExecutionHistory> {
    return this.prisma.workflowExecutionHistory.create({
      data: {
        ...data,
        status: data.status.toString(),
        executionData: data.executionData as unknown as Prisma.InputJsonValue,
      },
    }) as unknown as WorkflowExecutionHistory;
  }

  async createSchedule(
    data: Omit<WorkflowSchedule, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<WorkflowSchedule> {
    return this.prisma.workflowSchedule.create({
      data: {
        workflowId: data.workflowId,
        cron: data.cron,
        enabled: data.enabled,
        isActive: data.isActive,
        lastRun: data.lastRun,
        nextRun: data.nextRun,
        timezone: data.timezone || 'UTC',
      },
    }) as unknown as WorkflowSchedule;
  }

  async getWorkflowHistory(
    workflowId: string,
  ): Promise<WorkflowExecutionHistory[]> {
    const history = await this.prisma.workflowExecutionHistory.findMany({
      where: { workflowId },
      orderBy: { createdAt: 'desc' },
    });
    return history as unknown as WorkflowExecutionHistory[];
  }

  async updateScheduleStatus(
    scheduleId: string,
    isActive: boolean,
  ): Promise<WorkflowSchedule> {
    return this.prisma.workflowSchedule.update({
      where: { id: scheduleId },
      data: { isActive },
    }) as unknown as WorkflowSchedule;
  }
}
