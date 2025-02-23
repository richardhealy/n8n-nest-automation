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
var N8nService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.N8nService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const axios_1 = require("axios");
const workflow_execution_enum_1 = require("./types/workflow-execution.enum");
const common_2 = require("@nestjs/common");
const workflow_events_gateway_1 = require("./gateways/workflow-events.gateway");
let N8nService = N8nService_1 = class N8nService {
    constructor(prisma, config, eventsGateway) {
        this.prisma = prisma;
        this.config = config;
        this.eventsGateway = eventsGateway;
        this.logger = new common_2.Logger(N8nService_1.name);
        this.apiUrl = this.config.get('N8N_API_URL');
        console.log('Environment variables:', {
            N8N_API_URL: this.config.get('N8N_API_URL'),
            N8N_API_KEY: this.config.get('N8N_API_KEY'),
        });
        if (!this.apiUrl) {
            throw new Error('N8N_API_URL environment variable is not set');
        }
    }
    async createTemplate(user, createTemplateDto) {
        const template = await this.prisma.template.create({
            data: {
                name: createTemplateDto.name,
                description: createTemplateDto.description,
                tags: createTemplateDto.tags,
                config: createTemplateDto.config,
                user: { connect: { id: user.id } },
                organization: { connect: { id: user.organizationId } }
            },
            include: {
                organization: true,
                user: true
            }
        });
        return {
            ...template,
            config: template.config
        };
    }
    async validateOrganizationAccess(user, templateId) {
        const template = await this.prisma.template.findUnique({
            where: { id: templateId },
        });
        if (!template || template.organizationId !== user.organizationId) {
            throw new common_1.UnauthorizedException('No access to this template');
        }
        return template;
    }
    async getTemplate(user, id) {
        const template = await this.validateOrganizationAccess(user, id);
        return {
            ...template,
            config: template.config
        };
    }
    async createWorkflowFromTemplate(user, templateId) {
        const template = await this.getTemplate(user, templateId);
        const n8nResponse = await axios_1.default.post(`${this.apiUrl}/workflows`, {
            name: template.name,
            nodes: template.config.nodes,
            connections: template.config.connections,
            active: false,
        }, {
            headers: {
                'X-N8N-API-KEY': this.config.get('N8N_API_KEY'),
            },
        });
        return this.prisma.workflow.create({
            data: {
                name: template.name,
                description: template.description,
                config: {
                    ...template.config,
                    n8nWorkflowId: n8nResponse.data.id,
                    templateId: template.id,
                },
                userId: user.id,
            },
        });
    }
    async createWorkflow(user, dto) {
        console.log(`API URL ${this.apiUrl}/workflows`);
        try {
            const workflowData = {
                name: dto.name,
                nodes: dto.nodes || [],
                connections: dto.connections || {},
                settings: {
                    saveExecutionProgress: true,
                    saveManualExecutions: true,
                    saveDataErrorExecution: 'all',
                    saveDataSuccessExecution: 'all',
                    executionTimeout: 3600,
                    timezone: 'UTC',
                    ...dto.settings
                }
            };
            const response = await axios_1.default.post(`${this.apiUrl}/workflows`, workflowData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-N8N-API-KEY': this.config.get('N8N_API_KEY')
                },
            });
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error('N8N API Error:', error.response?.data);
                throw new common_1.HttpException(error.response?.data?.message || 'Failed to create workflow in N8N', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            throw error;
        }
    }
    async duplicateTemplate(user, templateId) {
        const template = await this.getTemplate(user, templateId);
        return this.prisma.workflow.create({
            data: {
                name: `Copy of ${template.name}`,
                description: template.description,
                config: template.config,
                userId: user.id,
            },
        });
    }
    async activateWorkflow(_user, workflowId) {
        const workflow = await this.prisma.workflow.findUnique({
            where: { id: workflowId }
        });
        if (!workflow?.config?.n8nWorkflowId) {
            throw new Error('N8N workflow ID not found');
        }
        try {
            const response = await axios_1.default.post(`${this.apiUrl}/workflows/${workflow?.config?.n8nWorkflowId}/activate`, {}, {
                headers: {
                    'X-N8N-API-KEY': this.config.get('N8N_API_KEY'),
                },
            });
            console.log('N8N response:', response.data);
            const updatedWorkflow = await this.prisma.workflow.update({
                where: { id: workflowId },
                data: { active: true },
            });
            this.eventsGateway.notifyWorkflowStatus(workflowId, true);
            return updatedWorkflow;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to activate workflow: ${error.message}`);
            }
            throw error;
        }
    }
    async deactivateWorkflow(_user, workflowId) {
        const workflow = await this.prisma.workflow.findUnique({
            where: { id: workflowId }
        });
        if (!workflow?.config?.n8nWorkflowId) {
            throw new Error('N8N workflow ID not found');
        }
        try {
            await axios_1.default.post(`${this.apiUrl}/workflows/${workflow?.config?.n8nWorkflowId}/deactivate`, {}, {
                headers: {
                    'X-N8N-API-KEY': this.config.get('N8N_API_KEY'),
                },
            });
            const updatedWorkflow = await this.prisma.workflow.update({
                where: { id: workflowId },
                data: { active: false },
            });
            this.eventsGateway.notifyWorkflowStatus(workflowId, false);
            return updatedWorkflow;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to deactivate workflow: ${error.message}`);
            }
            throw error;
        }
    }
    async validateWorkflowAccess(user, workflowId) {
        const workflow = await this.prisma.workflow.findUnique({
            where: { id: workflowId },
        });
        if (!workflow) {
            throw new common_1.NotFoundException('Workflow not found');
        }
        if (workflow.userId !== user.id) {
            throw new common_1.UnauthorizedException('No access to this workflow');
        }
        return workflow;
    }
    async startExecution(user, workflowId) {
        const workflow = await this.validateWorkflowAccess(user, workflowId);
        if (!workflow.config?.n8nWorkflowId) {
            throw new Error('N8N workflow ID not found');
        }
        const execution = await this.prisma.workflowExecution.create({
            data: {
                workflowId,
                status: workflow_execution_enum_1.WorkflowExecutionStatus.RUNNING,
            },
        });
        try {
            await axios_1.default.post(`${this.apiUrl}/workflows/${workflow.config.n8nWorkflowId}/execute`, {}, {
                headers: {
                    'X-N8N-API-KEY': this.config.get('N8N_API_KEY'),
                },
            });
            return execution;
        }
        catch (error) {
            await this.updateExecution(execution.id, {
                status: workflow_execution_enum_1.WorkflowExecutionStatus.FAILED,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            throw error;
        }
    }
    async updateExecution(executionId, updateDto) {
        const execution = await this.prisma.workflowExecution.update({
            where: { id: executionId },
            data: {
                status: updateDto.status,
                error: updateDto.error,
                result: updateDto.result,
                finishedAt: [workflow_execution_enum_1.WorkflowExecutionStatus.COMPLETED, workflow_execution_enum_1.WorkflowExecutionStatus.FAILED].includes(updateDto.status)
                    ? new Date()
                    : undefined,
            },
            include: {
                workflow: true,
            },
        });
        this.eventsGateway.notifyWorkflowExecution(execution.workflowId, {
            executionId,
            status: updateDto.status,
            error: updateDto.error,
            result: updateDto.result,
        });
        return execution;
    }
    async getWorkflowExecutions(user, workflowId) {
        await this.validateWorkflowAccess(user, workflowId);
        return this.prisma.workflowExecution.findMany({
            where: { workflowId },
            orderBy: { startedAt: 'desc' },
        });
    }
    async getExecution(user, executionId) {
        const execution = await this.prisma.workflowExecution.findUnique({
            where: { id: executionId },
            include: { workflow: true },
        });
        if (!execution) {
            throw new common_1.NotFoundException('Execution not found');
        }
        if (execution.workflow.userId !== user.id) {
            throw new common_1.UnauthorizedException('No access to this execution');
        }
        return execution;
    }
    async getWorkflowStatus(user, workflowId) {
        const workflow = await this.validateWorkflowAccess(user, workflowId);
        return { active: workflow.active };
    }
    async listWorkflows(user, filters) {
        const where = {
            userId: user.id,
        };
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        if (typeof filters.active === 'boolean') {
            where.active = filters.active;
        }
        return this.prisma.workflow.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                executions: {
                    orderBy: { startedAt: 'desc' },
                    take: 1,
                },
            },
        });
    }
    async getWorkflow(_user, id) {
        return this.prisma.workflow.findUnique({
            where: { id },
            include: {
                executions: {
                    orderBy: { startedAt: 'desc' },
                    take: 5,
                },
            },
        });
    }
    async updateWorkflow(user, id, updateDto) {
        await this.validateWorkflowAccess(user, id);
        return this.prisma.workflow.update({
            where: { id },
            data: updateDto,
        });
    }
    async deleteWorkflow(user, id) {
        await this.validateWorkflowAccess(user, id);
        const workflow = await this.prisma.workflow.findUnique({
            where: { id },
        });
        if (workflow?.active) {
            try {
                await axios_1.default.post(`${this.apiUrl}/workflows/${id}/deactivate`, {}, {
                    headers: {
                        'X-N8N-API-KEY': this.config.get('N8N_API_KEY'),
                    },
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    this.logger.error(`Failed to deactivate workflow in N8N: ${error.message}`);
                }
            }
        }
        await this.prisma.workflow.delete({
            where: { id },
        });
        return { success: true };
    }
    async listTemplates(user, filters) {
        const where = {
            organizationId: user.organizationId,
        };
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        if (filters.tag) {
            where.tags = {
                has: filters.tag,
            };
        }
        return this.prisma.template.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
    }
    async updateTemplate(user, templateId, updateDto) {
        await this.validateOrganizationAccess(user, templateId);
        return this.prisma.template.update({
            where: { id: templateId },
            data: {
                ...updateDto,
                config: updateDto.config,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
    }
    async deleteTemplate(user, templateId) {
        await this.validateOrganizationAccess(user, templateId);
        const workflowCount = await this.prisma.workflow.count({
            where: {
                config: {
                    path: ['templateId'],
                    equals: templateId,
                },
            },
        });
        if (workflowCount > 0) {
            throw new common_1.UnauthorizedException('Template is in use by workflows');
        }
        await this.prisma.template.delete({
            where: { id: templateId },
        });
        return { success: true };
    }
    async getTemplateStats(user, templateId) {
        await this.validateOrganizationAccess(user, templateId);
        const workflowCount = await this.prisma.workflow.count({
            where: {
                config: {
                    path: ['templateId'],
                    equals: templateId,
                },
            },
        });
        const activeWorkflowCount = await this.prisma.workflow.count({
            where: {
                config: {
                    path: ['templateId'],
                    equals: templateId,
                },
                active: true,
            },
        });
        return {
            totalWorkflows: workflowCount,
            activeWorkflows: activeWorkflowCount,
        };
    }
    async createWebhook(user, createWebhookDto) {
        await this.validateWorkflowAccess(user, createWebhookDto.workflowId);
        const n8nWebhook = await axios_1.default.post(`${this.apiUrl}/workflows/${createWebhookDto.workflowId}/webhooks`, {
            name: createWebhookDto.name,
            method: createWebhookDto.method,
            path: createWebhookDto.path,
            headers: createWebhookDto.headers,
        }, {
            headers: {
                'X-N8N-API-KEY': this.config.get('N8N_API_KEY'),
            },
        });
        return this.prisma.webhookEvent.create({
            data: {
                workflowId: createWebhookDto.workflowId,
                event: 'CREATED',
                payload: {
                    name: createWebhookDto.name,
                    method: createWebhookDto.method,
                    path: createWebhookDto.path,
                    n8nWebhookId: n8nWebhook.data.id,
                },
            },
            include: {
                workflow: true,
            },
        });
    }
    async updateWebhook(user, webhookId, updateDto) {
        const webhook = await this.prisma.webhookEvent.findUnique({
            where: { id: webhookId },
            include: { workflow: true },
        });
        if (!webhook) {
            throw new common_1.NotFoundException('Webhook not found');
        }
        await this.validateWorkflowAccess(user, webhook.workflowId);
        if (!webhook?.payload || typeof webhook.payload !== 'object') {
            throw new Error('Invalid webhook payload');
        }
        const payload = webhook.payload;
        await axios_1.default.patch(`${this.apiUrl}/webhooks/${payload.n8nWebhookId}`, updateDto, {
            headers: {
                'X-N8N-API-KEY': this.config.get('N8N_API_KEY'),
            },
        });
        return this.prisma.webhookEvent.update({
            where: { id: webhookId },
            data: {
                payload: {
                    ...payload,
                    ...updateDto,
                },
            },
            include: {
                workflow: true,
            },
        });
    }
    async deleteWebhook(user, webhookId) {
        const webhook = await this.prisma.webhookEvent.findUnique({
            where: { id: webhookId },
            include: { workflow: true },
        });
        if (!webhook) {
            throw new common_1.NotFoundException('Webhook not found');
        }
        if (!webhook.payload || typeof webhook.payload !== 'object') {
            throw new Error('Invalid webhook payload');
        }
        const payload = webhook.payload;
        await this.validateWorkflowAccess(user, webhook.workflowId);
        await axios_1.default.delete(`${this.apiUrl}/webhooks/${payload.n8nWebhookId}`, {
            headers: {
                'X-N8N-API-KEY': this.config.get('N8N_API_KEY'),
            },
        });
        await this.prisma.webhookEvent.delete({
            where: { id: webhookId },
        });
        return { success: true };
    }
    async getWorkflowWebhooks(user, workflowId) {
        await this.validateWorkflowAccess(user, workflowId);
        return this.prisma.webhookEvent.findMany({
            where: {
                workflowId,
                event: 'CREATED',
            },
            include: {
                workflow: true,
            },
        });
    }
    async executeWorkflow(workflowId, data) {
        const workflow = await this.prisma.workflow.findUnique({
            where: { id: workflowId },
        });
        if (!workflow) {
            throw new common_1.NotFoundException('Workflow not found');
        }
        if (!workflow.config?.n8nWorkflowId) {
            throw new Error('N8N workflow ID not found');
        }
        await axios_1.default.post(`${this.apiUrl}/workflows/${workflow.config.n8nWorkflowId}/execute`, {
            data,
        }, {
            headers: {
                'X-N8N-API-KEY': this.config.get('N8N_API_KEY'),
            },
        });
    }
};
exports.N8nService = N8nService;
exports.N8nService = N8nService = N8nService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        workflow_events_gateway_1.WorkflowEventsGateway])
], N8nService);
//# sourceMappingURL=n8n.service.js.map