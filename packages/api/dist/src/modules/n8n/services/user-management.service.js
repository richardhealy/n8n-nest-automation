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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManagementService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto_1 = require("crypto");
let UserManagementService = class UserManagementService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async inviteUser(admin, organizationId, inviteDto) {
        await this.validateAdminAccess(admin, organizationId);
        const existingUser = await this.prisma.user.findUnique({
            where: { email: inviteDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User already exists');
        }
        const inviteToken = this.generateInviteToken();
        const invitation = await this.prisma.userInvitation.create({
            data: {
                email: inviteDto.email,
                role: inviteDto.role,
                token: inviteToken,
                organization: { connect: { id: organizationId } },
                invitedBy: { connect: { id: admin.id } },
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return invitation;
    }
    async updateUserRole(admin, organizationId, userId, updateDto) {
        await this.validateAdminAccess(admin, organizationId);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.organizationId !== organizationId) {
            throw new common_1.NotFoundException('User not found in organization');
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: { role: updateDto.role },
            select: {
                id: true,
                email: true,
                role: true,
            },
        });
    }
    async removeUser(admin, organizationId, userId) {
        await this.validateAdminAccess(admin, organizationId);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.organizationId !== organizationId) {
            throw new common_1.NotFoundException('User not found in organization');
        }
        if (user.id === admin.id) {
            throw new common_1.UnauthorizedException('Cannot remove yourself from the organization');
        }
        const activeWorkflows = await this.prisma.workflow.findMany({
            where: {
                userId: user.id,
                active: true,
            },
        });
        for (const workflow of activeWorkflows) {
            await this.prisma.workflow.update({
                where: { id: workflow.id },
                data: { active: false },
            });
        }
        return this.prisma.user.delete({
            where: { id: userId },
        });
    }
    async listUsers(user, organizationId) {
        if (user.organizationId !== organizationId) {
            throw new common_1.UnauthorizedException('No access to this organization');
        }
        return this.prisma.user.findMany({
            where: { organizationId },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                workflows: {
                    select: {
                        id: true,
                        name: true,
                        active: true,
                    },
                },
            },
        });
    }
    async validateAdminAccess(user, organizationId) {
        if (user.organizationId !== organizationId || user.role !== 'ADMIN') {
            throw new common_1.UnauthorizedException('Admin access required');
        }
    }
    generateInviteToken() {
        return (0, crypto_1.randomBytes)(32).toString('hex');
    }
};
exports.UserManagementService = UserManagementService;
exports.UserManagementService = UserManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserManagementService);
//# sourceMappingURL=user-management.service.js.map