"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const cron = require("node-cron");
const workflow_history_service_1 = require("./workflow-history.service");
const n8n_service_1 = require("../n8n.service");
const prisma_service_1 = require("../../prisma/prisma.service");
let WorkflowSchedulerService = class WorkflowSchedulerService {
    constructor(historyService, n8nService, prisma) {
        this.historyService = historyService;
        this.n8nService = n8nService;
        this.prisma = prisma;
        this.scheduledJobs = new Map();
    }
    async onModuleInit() {
        const activeSchedules = await this.prisma.workflowSchedule.findMany({
            where: { isActive: true }
        });
        activeSchedules.forEach(schedule => {
            this.scheduleWorkflow(schedule);
        });
    }
    scheduleWorkflow(schedule) {
        const job = cron.schedule(schedule.cronExpression, async () => {
            try {
                await this.n8nService.executeWorkflow(schedule.workflowId, {});
                await this.prisma.workflowSchedule.update({
                    where: { id: schedule.id },
                    data: {
                        lastRun: new Date(),
                        nextRun: this.calculateNextRunDate(schedule.cronExpression)
                    }
                });
            }
            catch (error) {
                console.error(`Failed to execute scheduled workflow ${schedule.workflowId}:`, error);
            }
        }, {
            timezone: schedule.timezone
        });
        this.scheduledJobs.set(schedule.id, job);
    }
    calculateNextRunDate(cronExpression) {
        const nextDate = new Date();
        nextDate.setMinutes(nextDate.getMinutes() + 1);
        return nextDate;
    }
    async updateSchedule(scheduleId, isActive) {
        const existingJob = this.scheduledJobs.get(scheduleId);
        if (isActive) {
            const schedule = await this.historyService.updateScheduleStatus(scheduleId, true);
            if (existingJob) {
                existingJob.start();
            }
            else {
                this.scheduleWorkflow(schedule);
            }
        }
        else {
            await this.historyService.updateScheduleStatus(scheduleId, false);
            existingJob?.stop();
        }
    }
};
exports.WorkflowSchedulerService = WorkflowSchedulerService;
exports.WorkflowSchedulerService = WorkflowSchedulerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [workflow_history_service_1.WorkflowHistoryService,
        n8n_service_1.N8nService,
        prisma_service_1.PrismaService])
], WorkflowSchedulerService);
//# sourceMappingURL=workflow-scheduler.service.js.map