import { N8nService } from './n8n.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { User } from '@prisma/client';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { TemplatePresetService } from './services/template-preset.service';
import { ListWorkflowDto } from './dto/list-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { ListTemplateDto } from './dto/list-template.dto';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
export declare class N8nController {
    private readonly n8nService;
    private readonly templatePresetService;
    constructor(n8nService: N8nService, templatePresetService: TemplatePresetService);
    createTemplate(user: User, createTemplateDto: CreateTemplateDto): Promise<import("./types/workflow.types").Template>;
    getTemplate(user: User, id: string): Promise<import("./types/workflow.types").Template>;
    createWorkflowFromTemplate(user: User, templateId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        config: import("@prisma/client/runtime/library").JsonValue;
        active: boolean;
        userId: string;
        isTemplate: boolean;
    }>;
    createWorkflow(user: User, dto: CreateWorkflowDto): Promise<any>;
    duplicateTemplate(user: User, templateId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        config: import("@prisma/client/runtime/library").JsonValue;
        active: boolean;
        userId: string;
        isTemplate: boolean;
    }>;
    getPresets(): string[];
    createFromPreset(user: User, preset: string, data: {
        name: string;
        description: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        description: string;
        tags: string[];
        config: import("@prisma/client/runtime/library").JsonValue;
        userId: string;
    }>;
    activateWorkflow(user: User, workflowId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        config: import("@prisma/client/runtime/library").JsonValue;
        active: boolean;
        userId: string;
        isTemplate: boolean;
    }>;
    deactivateWorkflow(user: User, workflowId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        config: import("@prisma/client/runtime/library").JsonValue;
        active: boolean;
        userId: string;
        isTemplate: boolean;
    }>;
    getWorkflowStatus(user: User, workflowId: string): Promise<{
        active: boolean;
    }>;
    executeWorkflow(user: User, workflowId: string): Promise<{
        error: string | null;
        result: import("@prisma/client/runtime/library").JsonValue | null;
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
        result: import("@prisma/client/runtime/library").JsonValue | null;
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
            config: import("@prisma/client/runtime/library").JsonValue;
            active: boolean;
            userId: string;
            isTemplate: boolean;
        };
    } & {
        error: string | null;
        result: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        workflowId: string;
        startedAt: Date;
        finishedAt: Date | null;
    }>;
    listWorkflows(user: User, filters: ListWorkflowDto): Promise<({
        executions: {
            error: string | null;
            result: import("@prisma/client/runtime/library").JsonValue | null;
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
        config: import("@prisma/client/runtime/library").JsonValue;
        active: boolean;
        userId: string;
        isTemplate: boolean;
    })[]>;
    getWorkflow(user: User, id: string): Promise<{
        executions: {
            error: string | null;
            result: import("@prisma/client/runtime/library").JsonValue | null;
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
        config: import("@prisma/client/runtime/library").JsonValue;
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
        config: import("@prisma/client/runtime/library").JsonValue;
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
        config: import("@prisma/client/runtime/library").JsonValue;
        userId: string;
    })[]>;
    updateTemplate(user: User, id: string, updateDto: Partial<CreateTemplateDto>): Promise<{
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
        config: import("@prisma/client/runtime/library").JsonValue;
        userId: string;
    }>;
    deleteTemplate(user: User, id: string): Promise<{
        success: boolean;
    }>;
    getTemplateStats(user: User, id: string): Promise<{
        totalWorkflows: number;
        activeWorkflows: number;
    }>;
    createWebhook(user: User, workflowId: string, createWebhookDto: CreateWebhookDto): Promise<{
        workflow: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            config: import("@prisma/client/runtime/library").JsonValue;
            active: boolean;
            userId: string;
            isTemplate: boolean;
        };
    } & {
        event: string | null;
        id: string;
        createdAt: Date;
        workflowId: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
    }>;
    getWorkflowWebhooks(user: User, workflowId: string): Promise<({
        workflow: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            config: import("@prisma/client/runtime/library").JsonValue;
            active: boolean;
            userId: string;
            isTemplate: boolean;
        };
    } & {
        event: string | null;
        id: string;
        createdAt: Date;
        workflowId: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
    })[]>;
    updateWebhook(user: User, webhookId: string, updateDto: UpdateWebhookDto): Promise<{
        workflow: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            config: import("@prisma/client/runtime/library").JsonValue;
            active: boolean;
            userId: string;
            isTemplate: boolean;
        };
    } & {
        event: string | null;
        id: string;
        createdAt: Date;
        workflowId: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
    }>;
    deleteWebhook(user: User, webhookId: string): Promise<{
        success: boolean;
    }>;
}
