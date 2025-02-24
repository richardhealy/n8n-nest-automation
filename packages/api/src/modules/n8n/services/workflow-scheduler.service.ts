import { Injectable, type OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';
import type { PrismaService } from '../../prisma/prisma.service';
import type { N8nService } from '../n8n.service';
import type { WorkflowSchedule } from '../types/workflow-history.types';
import type { WorkflowHistoryService } from './workflow-history.service';

@Injectable()
export class WorkflowSchedulerService implements OnModuleInit {
  private scheduledJobs: Map<string, cron.ScheduledTask> = new Map();

  constructor(
    private readonly historyService: WorkflowHistoryService,
    private readonly n8nService: N8nService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    const activeSchedules = await this.prisma.workflowSchedule.findMany({
      where: { isActive: true },
    });

    for (const schedule of activeSchedules) {
      this.scheduleWorkflow(schedule as unknown as WorkflowSchedule);
    }
  }

  private scheduleWorkflow(schedule: WorkflowSchedule) {
    const job = cron.schedule(
      schedule.cron,
      async () => {
        try {
          // Execute the workflow
          await this.n8nService.executeWorkflow(schedule.workflowId, {});

          // Update last run time
          await this.prisma.workflowSchedule.update({
            where: { id: schedule.id },
            data: {
              lastRun: new Date(),
              nextRun: this.calculateNextRunDate(schedule.cron),
            },
          });
        } catch (error) {
          console.error(
            `Failed to execute scheduled workflow ${schedule.workflowId}:`,
            error,
          );
        }
      },
      {
        timezone: schedule.timezone,
      },
    );

    this.scheduledJobs.set(schedule.id, job);
  }

  private calculateNextRunDate(cronExpression: string): Date {
    const nextDate = new Date();
    nextDate.setMinutes(nextDate.getMinutes() + 1); // Simple next run calculation
    return nextDate;
  }

  async updateSchedule(scheduleId: string, isActive: boolean) {
    const existingJob = this.scheduledJobs.get(scheduleId);

    if (isActive) {
      const schedule = await this.historyService.updateScheduleStatus(
        scheduleId,
        true,
      );
      if (existingJob) {
        existingJob.start();
      } else {
        this.scheduleWorkflow(schedule);
      }
    } else {
      await this.historyService.updateScheduleStatus(scheduleId, false);
      existingJob?.stop();
    }
  }
}
