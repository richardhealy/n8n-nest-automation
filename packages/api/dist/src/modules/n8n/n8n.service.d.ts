import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { Template } from './types/workflow.types';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { User, Workflow } from '@prisma/client';
import { UpdateWorkflowExecutionDto } from './dto/workflow-execution.dto';
import { ListWorkflowDto } from './dto/list-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { ListTemplateDto } from './dto/list-template.dto';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { WorkflowEventsGateway } from './gateways/workflow-events.gateway';
import { Prisma } from '@prisma/client';
export declare class N8nService {
    private readonly prisma;
    private readonly config;
    private readonly eventsGateway;
    private readonly logger;
    private readonly apiUrl;
    constructor(prisma: PrismaService, config: ConfigService, eventsGateway: WorkflowEventsGateway);
    createTemplate(user: User, createTemplateDto: CreateTemplateDto): Promise<Template>;
    private validateOrganizationAccess;
    getTemplate(user: User, id: string): Promise<Template>;
    createWorkflowFromTemplate(user: User, templateId: string): Promise<Workflow>;
    createWorkflow(user: User, dto: CreateWorkflowDto): Promise<any>;
    duplicateTemplate(user: User, templateId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        config: Prisma.JsonValue;
        active: boolean;
        userId: string;
        isTemplate: boolean;
    }>;
    activateWorkflow(_user: User, workflowId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        config: Prisma.JsonValue;
        active: boolean;
        userId: string;
        isTemplate: boolean;
    }>;
    deactivateWorkflow(_user: User, workflowId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        config: Prisma.JsonValue;
        active: boolean;
        userId: string;
        isTemplate: boolean;
    }>;
    validateWorkflowAccess(user: User, workflowId: string): Promise<Workflow>;
    startExecution(user: User, workflowId: string): Promise<{
        error: string | null;
        result: Prisma.JsonValue | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        workflowId: string;
        startedAt: Date;
        finishedAt: Date | null;
    }>;
    updateExecution(executionId: string, updateDto: UpdateWorkflowExecutionDto): Promise<{
        workflow: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            config: Prisma.JsonValue;
            active: boolean;
            userId: string;
            isTemplate: boolean;
        };
    } & {
        error: string | null;
        result: Prisma.JsonValue | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        workflowId: string;
        startedAt: Date;
        finishedAt: Date | null;
    }>;
    getWorkflowExecutions(user: User, workflowId: string): Promise<{
        error: string | null;
        result: Prisma.JsonValue | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        workflowId: string;
        startedAt: Date;
        finishedAt: Date | null;
    }[]>;
    getExecution(user: User, executionId: string): Promise<{
        workflow: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            config: Prisma.JsonValue;
            active: boolean;
            userId: string;
            isTemplate: boolean;
        };
    } & {
        error: string | null;
        result: Prisma.JsonValue | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        workflowId: string;
        startedAt: Date;
        finishedAt: Date | null;
    }>;
    getWorkflowStatus(user: User, workflowId: string): Promise<{
        active: boolean;
    }>;
    listWorkflows(user: User, filters: ListWorkflowDto): Promise<({
        executions: {
            error: string | null;
            result: Prisma.JsonValue | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            workflowId: string;
            startedAt: Date;
            finishedAt: Date | null;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        config: Prisma.JsonValue;
        active: boolean;
        userId: string;
        isTemplate: boolean;
    })[]>;
    getWorkflow(_user: User, id: string): Promise<{
        executions: {
            error: string | null;
            result: Prisma.JsonValue | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            workflowId: string;
            startedAt: Date;
            finishedAt: Date | null;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        config: Prisma.JsonValue;
        active: boolean;
        userId: string;
        isTemplate: boolean;
    }>;
    updateWorkflow(user: User, id: string, updateDto: UpdateWorkflowDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        config: Prisma.JsonValue;
        active: boolean;
        userId: string;
        isTemplate: boolean;
    }>;
    deleteWorkflow(user: User, id: string): Promise<{
        success: boolean;
    }>;
    listTemplates(user: User, filters: ListTemplateDto): Promise<({
        user: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        description: string;
        tags: string[];
        config: Prisma.JsonValue;
        userId: string;
    })[]>;
    updateTemplate(user: User, templateId: string, updateDto: Partial<CreateTemplateDto>): Promise<{
        user: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        description: string;
        tags: string[];
        config: Prisma.JsonValue;
        userId: string;
    }>;
    deleteTemplate(user: User, templateId: string): Promise<{
        success: boolean;
    }>;
    getTemplateStats(user: User, templateId: string): Promise<{
        totalWorkflows: number;
        activeWorkflows: number;
    }>;
    createWebhook(user: User, createWebhookDto: CreateWebhookDto): Promise<{
        workflow: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            config: Prisma.JsonValue;
            active: boolean;
            userId: string;
            isTemplate: boolean;
        };
    } & {
        event: string | null;
        id: string;
        createdAt: Date;
        workflowId: string;
        payload: Prisma.JsonValue;
    }>;
    updateWebhook(user: User, webhookId: string, updateDto: UpdateWebhookDto): Promise<{
        workflow: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            config: Prisma.JsonValue;
            active: boolean;
            userId: string;
            isTemplate: boolean;
        };
    } & {
        event: string | null;
        id: string;
        createdAt: Date;
        workflowId: string;
        payload: Prisma.JsonValue;
    }>;
    deleteWebhook(user: User, webhookId: string): Promise<{
        success: boolean;
    }>;
    getWorkflowWebhooks(user: User, workflowId: string): Promise<({
        workflow: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            config: Prisma.JsonValue;
            active: boolean;
            userId: string;
            isTemplate: boolean;
        };
    } & {
        event: string | null;
        id: string;
        createdAt: Date;
        workflowId: string;
        payload: Prisma.JsonValue;
    })[]>;
    executeWorkflow(workflowId: string, data: Record<string, any>): Promise<void>;
}
