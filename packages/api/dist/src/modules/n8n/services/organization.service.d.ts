import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { User, Prisma } from '@prisma/client';
export declare class OrganizationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: CreateOrganizationDto): Promise<{
        id: string;
        name: string;
        apiKey: string;
        whiteLabel: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(user: User, id: string, updateDto: UpdateOrganizationDto): Promise<{
        id: string;
        name: string;
        apiKey: string;
        whiteLabel: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getOrganization(user: User, id: string): Promise<{
        templates: {
            id: string;
            name: string;
            description: string;
            tags: string[];
        }[];
        users: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
        }[];
    } & {
        id: string;
        name: string;
        apiKey: string;
        whiteLabel: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    regenerateApiKey(user: User, id: string): Promise<{
        apiKey: string;
    }>;
    getStats(user: User, id: string): Promise<{
        users: number;
        templates: number;
        workflows: number;
        activeWorkflows: number;
    }>;
    private validateAccess;
    private generateApiKey;
}
