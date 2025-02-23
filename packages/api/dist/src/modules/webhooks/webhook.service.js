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
const config_1 = require("@nestjs/config");
const n8n_service_1 = require("../n8n/n8n.service");
const axios_1 = require("axios");
let WebhookService = WebhookService_1 = class WebhookService {
    constructor(n8nService, config) {
        this.n8nService = n8nService;
        this.config = config;
        this.logger = new common_1.Logger(WebhookService_1.name);
    }
    async processWebhook(organizationId, workflowId, payload) {
        try {
            this.logger.debug(`Processing webhook for organization ${organizationId}, workflow ${workflowId}`);
            const webhookUrl = `${this.config.get('N8N_API_URL')}/workflows/${workflowId}/webhook`;
            if (!webhookUrl) {
                throw new Error('N8N_API_URL is not configured');
            }
            const apiKey = this.config.get('N8N_API_KEY');
            if (!apiKey) {
                throw new Error('N8N_API_KEY is not configured');
            }
            const response = await axios_1.default.post(webhookUrl, {
                data: payload,
                organizationId,
            }, {
                headers: {
                    'X-N8N-API-KEY': apiKey,
                },
            });
            return {
                success: true,
                data: response.data,
            };
        }
        catch (error) {
            this.logger.error(`Error processing webhook: ${error instanceof Error ? error.message : 'Unknown error'}`, error instanceof Error ? error.stack : undefined);
            throw error;
        }
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = WebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [n8n_service_1.N8nService,
        config_1.ConfigService])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map