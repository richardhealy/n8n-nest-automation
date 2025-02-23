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
exports.WorkflowHistoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let WorkflowHistoryService = class WorkflowHistoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createExecutionHistory(data) {
        return this.prisma.workflowExecutionHistory.create({
            data: {
                ...data,
                status: data.status.toString(),
                executionData: data.executionData
            }
        });
    }
    async createSchedule(data) {
        return this.prisma.workflowSchedule.create({
            data: {
                ...data,
                lastRun: data.lastRun || null,
                nextRun: data.nextRun || null
            }
        });
    }
    async getWorkflowHistory(workflowId) {
        const history = await this.prisma.workflowExecutionHistory.findMany({
            where: { workflowId },
            orderBy: { createdAt: 'desc' }
        });
        return history;
    }
    async updateScheduleStatus(scheduleId, isActive) {
        return this.prisma.workflowSchedule.update({
            where: { id: scheduleId },
            data: { isActive }
        });
    }
};
exports.WorkflowHistoryService = WorkflowHistoryService;
exports.WorkflowHistoryService = WorkflowHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkflowHistoryService);
//# sourceMappingURL=workflow-history.service.js.map