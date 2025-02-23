"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.N8nModule = void 0;
const common_1 = require("@nestjs/common");
const n8n_controller_1 = require("./n8n.controller");
const n8n_service_1 = require("./n8n.service");
const template_preset_service_1 = require("./services/template-preset.service");
const organization_service_1 = require("./services/organization.service");
const organization_controller_1 = require("./controllers/organization.controller");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("../prisma/prisma.module");
const user_management_service_1 = require("./services/user-management.service");
const user_management_controller_1 = require("./controllers/user-management.controller");
const bull_1 = require("@nestjs/bull");
const webhook_queue_service_1 = require("./services/webhook-queue.service");
const webhook_controller_1 = require("./controllers/webhook.controller");
const workflow_events_gateway_1 = require("./gateways/workflow-events.gateway");
const workflow_history_service_1 = require("./services/workflow-history.service");
const workflow_scheduler_service_1 = require("./services/workflow-scheduler.service");
const auth_module_1 = require("../auth/auth.module");
const workflow_controller_1 = require("./controllers/workflow.controller");
const workflow_service_1 = require("./services/workflow.service");
let N8nModule = class N8nModule {
};
exports.N8nModule = N8nModule;
exports.N8nModule = N8nModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            bull_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    redis: {
                        host: configService.get('REDIS_HOST'),
                        port: configService.get('REDIS_PORT'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            bull_1.BullModule.registerQueue({
                name: 'webhook-events',
            }),
        ],
        controllers: [
            n8n_controller_1.N8nController,
            organization_controller_1.OrganizationController,
            user_management_controller_1.UserManagementController,
            webhook_controller_1.WebhookController,
            workflow_controller_1.WorkflowController,
        ],
        providers: [
            n8n_service_1.N8nService,
            template_preset_service_1.TemplatePresetService,
            organization_service_1.OrganizationService,
            user_management_service_1.UserManagementService,
            webhook_queue_service_1.WebhookQueueService,
            workflow_events_gateway_1.WorkflowEventsGateway,
            workflow_history_service_1.WorkflowHistoryService,
            workflow_scheduler_service_1.WorkflowSchedulerService,
            workflow_service_1.WorkflowService,
        ],
        exports: [n8n_service_1.N8nService, workflow_history_service_1.WorkflowHistoryService],
    })
], N8nModule);
//# sourceMappingURL=n8n.module.js.map