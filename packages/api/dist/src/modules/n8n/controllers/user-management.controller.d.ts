import { UserManagementService } from '../services/user-management.service';
import { User } from '@prisma/client';
import { InviteUserDto } from '../dto/invite-user.dto';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';
export declare class UserManagementController {
    private readonly userManagementService;
    constructor(userManagementService: UserManagementService);
    inviteUser(user: User, organizationId: string, inviteDto: InviteUserDto): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
        organizationId: string;
        token: string;
        invitedById: string;
        expiresAt: Date;
    }>;
    updateUserRole(user: User, organizationId: string, userId: string, updateDto: UpdateUserRoleDto): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    removeUser(user: User, organizationId: string, userId: string): Promise<{
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
}
