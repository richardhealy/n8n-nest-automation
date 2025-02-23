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
var WebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const webhook_queue_service_1 = require("../services/webhook-queue.service");
const prisma_service_1 = require("../../prisma/prisma.service");
let WebhookController = WebhookController_1 = class WebhookController {
    constructor(webhookQueue, prisma) {
        this.webhookQueue = webhookQueue;
        this.prisma = prisma;
        this.logger = new common_1.Logger(WebhookController_1.name);
    }
    async handleWebhook(token, headers, payload) {
        this.logger.debug(`Received webhook event for token: ${token}`);
        const webhook = await this.prisma.webhookEvent.findFirst({
            where: {
                payload: {
                    path: ['token'],
                    equals: token,
                },
            },
            include: {
                workflow: true,
            },
        });
        if (!webhook) {
            throw new common_1.NotFoundException('Webhook not found');
        }
        if (!webhook.workflow.active) {
            throw new common_1.UnauthorizedException('Workflow is not active');
        }
        await this.webhookQueue.addToQueue({
            workflowId: webhook.workflowId,
            event: headers['x-webhook-event'] || 'default',
            data: {
                headers,
                body: payload,
                timestamp: new Date().toISOString(),
            },
        });
        return { success: true };
    }
    async getQueueStatus() {
        return this.webhookQueue.getQueueStatus();
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.Post)(':token'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Headers)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Get)('queue/status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "getQueueStatus", null);
exports.WebhookController = WebhookController = WebhookController_1 = __decorate([
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [webhook_queue_service_1.WebhookQueueService,
        prisma_service_1.PrismaService])
], WebhookController);
//# sourceMappingURL=webhook.controller.js.map