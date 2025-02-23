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
var WebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WebhookService = WebhookService_1 = class WebhookService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(WebhookService_1.name);
    }
    async handleWebhook(webhookDto) {
        this.logger.log(`Processing webhook for workflow: ${webhookDto.workflowId}`);
        await this.prisma.webhookEvent.create({
            data: {
                workflowId: webhookDto.workflowId,
                payload: webhookDto.payload,
                event: webhookDto.event,
            },
        });
        switch (webhookDto.event) {
            case 'workflow.completed':
                return this.handleWorkflowCompletion(webhookDto);
            case 'workflow.error':
                return this.handleWorkflowError(webhookDto);
            default:
                return this.handleGenericWebhook(webhookDto);
        }
    }
    async handleWorkflowCompletion(webhookDto) {
        return { status: 'success', message: 'Webhook processed' };
    }
    async handleWorkflowError(webhookDto) {
        this.logger.error(`Workflow error: ${JSON.stringify(webhookDto.payload)}`);
        return { status: 'error', message: 'Error processed' };
    }
    async handleGenericWebhook(webhookDto) {
        return { status: 'success', message: 'Generic webhook processed' };
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = WebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map