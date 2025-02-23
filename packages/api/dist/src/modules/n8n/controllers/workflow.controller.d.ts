import { User } from '@prisma/client';
import { WorkflowService } from '../services/workflow.service';
import { CreateWorkflowDto } from '../dto/create-workflow.dto';
export declare class WorkflowController {
    private readonly workflowService;
    constructor(workflowService: WorkflowService);
    create(user: User, createWorkflowDto: CreateWorkflowDto): Promise<{
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
    findAll(user: User): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        config: import("@prisma/client/runtime/library").JsonValue;
        active: boolean;
        userId: string;
        isTemplate: boolean;
    }[]>;
    activate(user: User, id: string): Promise<{
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
    deactivate(user: User, id: string): Promise<{
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
    remove(user: User, id: string): Promise<{
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
}
