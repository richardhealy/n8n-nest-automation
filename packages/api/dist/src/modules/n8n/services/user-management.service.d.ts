import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import { InviteUserDto } from '../dto/invite-user.dto';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';
export declare class UserManagementService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    inviteUser(admin: User, organizationId: string, inviteDto: InviteUserDto): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        organizationId: string;
        token: string;
        invitedById: string;
        expiresAt: Date;
    }>;
    updateUserRole(admin: User, organizationId: string, userId: string, updateDto: UpdateUserRoleDto): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    removeUser(admin: User, organizationId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.UserRole;
        organizationId: string;
    }>;
    listUsers(user: User, organizationId: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        workflows: {
            id: string;
            name: string;
            active: boolean;
        }[];
    }[]>;
    private validateAdminAccess;
    private generateInviteToken;
}
