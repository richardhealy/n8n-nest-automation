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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WebhookQueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookQueueService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const n8n_service_1 = require("../n8n.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const workflow_execution_enum_1 = require("../types/workflow-execution.enum");
const workflow_events_gateway_1 = require("../gateways/workflow-events.gateway");
let WebhookQueueService = WebhookQueueService_1 = class WebhookQueueService {
    constructor(webhookQueue, n8nService, prisma, eventsGateway) {
        this.webhookQueue = webhookQueue;
        this.n8nService = n8nService;
        this.prisma = prisma;
        this.eventsGateway = eventsGateway;
        this.logger = new common_1.Logger(WebhookQueueService_1.name);
    }
    async addToQueue(payload) {
        return this.webhookQueue.add('process-webhook', payload, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
            removeOnComplete: true,
            removeOnFail: false,
        });
    }
    async processWebhook(job) {
        this.logger.debug(`Processing webhook event ${job.id}`);
        const { workflowId, event, data } = job.data;
        const startTime = Date.now();
        try {
            const queuePosition = await this.webhookQueue.getJobCountByTypes('waiting');
            this.eventsGateway.notifyQueueUpdate(queuePosition, queuePosition + 1, workflowId);
            const execution = await this.prisma.workflowExecution.create({
                data: {
                    workflowId,
                    status: workflow_execution_enum_1.WorkflowExecutionStatus.RUNNING,
                },
                include: {
                    workflow: true,
                },
            });
            this.eventsGateway.notifyProgress(workflowId, {
                step: 'STARTED',
                percentage: 0,
                message: 'Starting workflow execution',
                timestamp: new Date(),
            });
            await this.prisma.webhookEvent.create({
                data: {
                    workflowId,
                    event,
                    payload: data,
                },
            });
            this.eventsGateway.notifyProgress(workflowId, {
                step: 'PROCESSING',
                percentage: 50,
                message: 'Processing webhook data',
                timestamp: new Date(),
            });
            await this.n8nService.executeWorkflow(workflowId, data);
            const executionTime = Date.now() - startTime;
            const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
            await this.prisma.workflowExecution.update({
                where: { id: execution.id },
                data: {
                    status: workflow_execution_enum_1.WorkflowExecutionStatus.COMPLETED,
                    finishedAt: new Date(),
                },
            });
            this.eventsGateway.notifyProgress(workflowId, {
                step: 'COMPLETED',
                percentage: 100,
                message: 'Workflow execution completed',
                timestamp: new Date(),
            });
            this.eventsGateway.notifyWorkflowMetrics(workflowId, {
                executionTime,
                memoryUsage,
                successRate: 100,
                lastExecuted: new Date(),
            });
            return { success: true };
        }
        catch (error) {
            if (error instanceof Error) {
                this.logger.error(`Failed to process webhook: ${error.message}`);
            }
            else {
                this.logger.error("Failed to process webhook: Unknown error");
            }
            const execution = await this.prisma.workflowExecution.create({
                data: {
                    workflowId,
                    status: workflow_execution_enum_1.WorkflowExecutionStatus.FAILED,
                    error: error instanceof Error ? error.message : 'Unknown error'
                }
            });
            this.handleExecutionError(error, execution);
            this.eventsGateway.notifyProgress(workflowId, {
                step: 'FAILED',
                percentage: 100,
                message: `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                timestamp: new Date(),
            });
            throw error;
        }
    }
    async getQueueStatus() {
        const [waiting, active, completed, failed] = await Promise.all([
            this.webhookQueue.getWaitingCount(),
            this.webhookQueue.getActiveCount(),
            this.webhookQueue.getCompletedCount(),
            this.webhookQueue.getFailedCount(),
        ]);
        return {
            waiting,
            active,
            completed,
            failed,
        };
    }
    handleExecutionError(error, workflowExecution) {
        try {
            this.eventsGateway.notifyError(workflowExecution.workflow.userId, {
                message: error.message,
                workflowId: workflowExecution.workflowId,
                severity: 'error'
            });
        }
        catch (err) {
            console.error('Failed to notify error:', err);
        }
    }
};
exports.WebhookQueueService = WebhookQueueService;
__decorate([
    (0, bull_1.Process)('process-webhook'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhookQueueService.prototype, "processWebhook", null);
exports.WebhookQueueService = WebhookQueueService = WebhookQueueService_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, bull_1.Processor)('webhook-events'),
    __param(0, (0, bull_1.InjectQueue)('webhook-events')),
    __metadata("design:paramtypes", [Object, n8n_service_1.N8nService,
        prisma_service_1.PrismaService,
        workflow_events_gateway_1.WorkflowEventsGateway])
], WebhookQueueService);
//# sourceMappingURL=webhook-queue.service.js.map