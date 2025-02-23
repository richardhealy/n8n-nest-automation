import { PrismaService } from '../../prisma/prisma.service';
import { N8nService } from '../n8n.service';
import { User } from '@prisma/client';
import { CreateWorkflowDto } from '../dto/create-workflow.dto';
import { Workflow } from '@prisma/client';
import { Prisma } from '@prisma/client';
export declare class WorkflowService {
    private readonly prisma;
    private readonly n8nService;
    constructor(prisma: PrismaService, n8nService: N8nService);
    create(user: User, createWorkflowDto: CreateWorkflowDto): Promise<Workflow>;
    findAll(user: User): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        config: Prisma.JsonValue;
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
        config: Prisma.JsonValue;
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
        config: Prisma.JsonValue;
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
        config: Prisma.JsonValue;
        active: boolean;
        userId: string;
        isTemplate: boolean;
    }>;
    private validateAccess;
}
