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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const webhook_service_1 = require("./webhook.service");
const webhook_dto_1 = require("./dto/webhook.dto");
const config_1 = require("@nestjs/config");
let WebhookController = class WebhookController {
    constructor(webhookService, config) {
        this.webhookService = webhookService;
        this.config = config;
    }
    async handleWebhook(signature, webhookDto) {
        if (!this.verifyWebhookSignature(signature, webhookDto)) {
            throw new common_1.UnauthorizedException('Invalid webhook signature');
        }
        return this.webhookService.handleWebhook(webhookDto);
    }
    verifyWebhookSignature(signature, payload) {
        const webhookSecret = this.config.get('N8N_WEBHOOK_SECRET');
        return true;
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Headers)('x-n8n-signature')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, webhook_dto_1.WebhookDto]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleWebhook", null);
exports.WebhookController = WebhookController = __decorate([
    (0, common_1.Controller)('webhooks/n8n'),
    __metadata("design:paramtypes", [webhook_service_1.WebhookService,
        config_1.ConfigService])
], WebhookController);
//# sourceMappingURL=webhook.controller.js.map