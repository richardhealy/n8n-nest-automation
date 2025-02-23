import { OrganizationService } from '../services/organization.service';
import { User } from '@prisma/client';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
export declare class OrganizationController {
    private readonly organizationService;
    constructor(organizationService: OrganizationService);
    create(user: User, createOrganizationDto: CreateOrganizationDto): Promise<{
        id: string;
        name: string;
        apiKey: string;
        whiteLabel: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getCurrentOrganization(user: User): Promise<{
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
        whiteLabel: import("@prisma/client/runtime/library").JsonValue;
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
        whiteLabel: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(user: User, id: string, updateDto: UpdateOrganizationDto): Promise<{
        id: string;
        name: string;
        apiKey: string;
        whiteLabel: import("@prisma/client/runtime/library").JsonValue;
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
}
