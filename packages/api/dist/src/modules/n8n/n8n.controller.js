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
exports.N8nController = void 0;
const common_1 = require("@nestjs/common");
const n8n_service_1 = require("./n8n.service");
const create_template_dto_1 = require("./dto/create-template.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../auth/types/user-role.enum");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const create_workflow_dto_1 = require("./dto/create-workflow.dto");
const template_preset_service_1 = require("./services/template-preset.service");
const list_workflow_dto_1 = require("./dto/list-workflow.dto");
const update_workflow_dto_1 = require("./dto/update-workflow.dto");
const list_template_dto_1 = require("./dto/list-template.dto");
const create_webhook_dto_1 = require("./dto/create-webhook.dto");
const update_webhook_dto_1 = require("./dto/update-webhook.dto");
let N8nController = class N8nController {
    constructor(n8nService, templatePresetService) {
        this.n8nService = n8nService;
        this.templatePresetService = templatePresetService;
    }
    async createTemplate(user, createTemplateDto) {
        return this.n8nService.createTemplate(user, createTemplateDto);
    }
    async getTemplate(user, id) {
        return this.n8nService.getTemplate(user, id);
    }
    async createWorkflowFromTemplate(user, templateId) {
        return this.n8nService.createWorkflowFromTemplate(user, templateId);
    }
    createWorkflow(user, dto) {
        return this.n8nService.createWorkflow(user, dto);
    }
    duplicateTemplate(user, templateId) {
        return this.n8nService.duplicateTemplate(user, templateId);
    }
    getPresets() {
        return this.templatePresetService.getAvailablePresets();
    }
    createFromPreset(user, preset, data) {
        return this.templatePresetService.createFromPreset(user, preset, data.name, data.description);
    }
    async activateWorkflow(user, workflowId) {
        return this.n8nService.activateWorkflow(user, workflowId);
    }
    async deactivateWorkflow(user, workflowId) {
        return this.n8nService.deactivateWorkflow(user, workflowId);
    }
    async getWorkflowStatus(user, workflowId) {
        return this.n8nService.getWorkflowStatus(user, workflowId);
    }
    async executeWorkflow(user, workflowId) {
        return this.n8nService.startExecution(user, workflowId);
    }
    async getWorkflowExecutions(user, workflowId) {
        return this.n8nService.getWorkflowExecutions(user, workflowId);
    }
    async getExecution(user, executionId) {
        return this.n8nService.getExecution(user, executionId);
    }
    async listWorkflows(user, filters) {
        return this.n8nService.listWorkflows(user, filters);
    }
    async getWorkflow(user, id) {
        return this.n8nService.getWorkflow(user, id);
    }
    async updateWorkflow(user, id, updateDto) {
        return this.n8nService.updateWorkflow(user, id, updateDto);
    }
    async deleteWorkflow(user, id) {
        return this.n8nService.deleteWorkflow(user, id);
    }
    async listTemplates(user, filters) {
        return this.n8nService.listTemplates(user, filters);
    }
    async updateTemplate(user, id, updateDto) {
        return this.n8nService.updateTemplate(user, id, updateDto);
    }
    async deleteTemplate(user, id) {
        return this.n8nService.deleteTemplate(user, id);
    }
    async getTemplateStats(user, id) {
        return this.n8nService.getTemplateStats(user, id);
    }
    async createWebhook(user, workflowId, createWebhookDto) {
        return this.n8nService.createWebhook(user, {
            ...createWebhookDto,
            workflowId,
        });
    }
    async getWorkflowWebhooks(user, workflowId) {
        return this.n8nService.getWorkflowWebhooks(user, workflowId);
    }
    async updateWebhook(user, webhookId, updateDto) {
        return this.n8nService.updateWebhook(user, webhookId, updateDto);
    }
    async deleteWebhook(user, webhookId) {
        return this.n8nService.deleteWebhook(user, webhookId);
    }
};
exports.N8nController = N8nController;
__decorate([
    (0, common_1.Post)('templates'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_template_dto_1.CreateTemplateDto]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)('templates/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Post)('templates/:id/workflows'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "createWorkflowFromTemplate", null);
__decorate([
    (0, common_1.Post)('workflows'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_workflow_dto_1.CreateWorkflowDto]),
    __metadata("design:returntype", void 0)
], N8nController.prototype, "createWorkflow", null);
__decorate([
    (0, common_1.Post)('templates/:id/duplicate'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], N8nController.prototype, "duplicateTemplate", null);
__decorate([
    (0, common_1.Get)('presets'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], N8nController.prototype, "getPresets", null);
__decorate([
    (0, common_1.Post)('presets/:preset'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('preset')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], N8nController.prototype, "createFromPreset", null);
__decorate([
    (0, common_1.Post)('workflows/:id/activate'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "activateWorkflow", null);
__decorate([
    (0, common_1.Post)('workflows/:id/deactivate'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "deactivateWorkflow", null);
__decorate([
    (0, common_1.Get)('workflows/:id/status'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "getWorkflowStatus", null);
__decorate([
    (0, common_1.Post)('workflows/:id/execute'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "executeWorkflow", null);
__decorate([
    (0, common_1.Get)('workflows/:id/executions'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "getWorkflowExecutions", null);
__decorate([
    (0, common_1.Get)('executions/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "getExecution", null);
__decorate([
    (0, common_1.Get)('workflows'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_workflow_dto_1.ListWorkflowDto]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "listWorkflows", null);
__decorate([
    (0, common_1.Get)('workflows/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "getWorkflow", null);
__decorate([
    (0, common_1.Patch)('workflows/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_workflow_dto_1.UpdateWorkflowDto]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "updateWorkflow", null);
__decorate([
    (0, common_1.Delete)('workflows/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "deleteWorkflow", null);
__decorate([
    (0, common_1.Get)('templates'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_template_dto_1.ListTemplateDto]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "listTemplates", null);
__decorate([
    (0, common_1.Patch)('templates/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Delete)('templates/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "deleteTemplate", null);
__decorate([
    (0, common_1.Get)('templates/:id/stats'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "getTemplateStats", null);
__decorate([
    (0, common_1.Post)('workflows/:id/webhooks'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_webhook_dto_1.CreateWebhookDto]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "createWebhook", null);
__decorate([
    (0, common_1.Get)('workflows/:id/webhooks'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "getWorkflowWebhooks", null);
__decorate([
    (0, common_1.Patch)('webhooks/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_webhook_dto_1.UpdateWebhookDto]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "updateWebhook", null);
__decorate([
    (0, common_1.Delete)('webhooks/:id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.USER),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], N8nController.prototype, "deleteWebhook", null);
exports.N8nController = N8nController = __decorate([
    (0, common_1.Controller)('n8n'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [n8n_service_1.N8nService,
        template_preset_service_1.TemplatePresetService])
], N8nController);
//# sourceMappingURL=n8n.controller.js.map