import { randomBytes } from 'node:crypto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import type { PrismaService } from '../../prisma/prisma.service';
import type { InviteUserDto } from '../dto/invite-user.dto';
import type { UpdateUserRoleDto } from '../dto/update-user-role.dto';

@Injectable()
export class UserManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async inviteUser(
    admin: User,
    organizationId: string,
    inviteDto: InviteUserDto,
  ) {
    await this.validateAdminAccess(admin, organizationId);

    const existingUser = await this.prisma.user.findUnique({
      where: { email: inviteDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const inviteToken = this.generateInviteToken();

    const invitation = await this.prisma.userInvitation.create({
      data: {
        email: inviteDto.email,
        role: inviteDto.role,
        token: inviteToken,
        organization: { connect: { id: organizationId } },
        invitedBy: { connect: { id: admin.id } },
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // TODO: Send invitation email

    return invitation;
  }

  async updateUserRole(
    admin: User,
    organizationId: string,
    userId: string,
    updateDto: UpdateUserRoleDto,
  ) {
    await this.validateAdminAccess(admin, organizationId);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.organizationId !== organizationId) {
      throw new NotFoundException('User not found in organization');
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

  async removeUser(admin: User, organizationId: string, userId: string) {
    await this.validateAdminAccess(admin, organizationId);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.organizationId !== organizationId) {
      throw new NotFoundException('User not found in organization');
    }

    if (user.id === admin.id) {
      throw new UnauthorizedException(
        'Cannot remove yourself from the organization',
      );
    }

    // Deactivate all user's workflows first
    const activeWorkflows = await this.prisma.workflow.findMany({
      where: {
        userId: user.id,
        active: true,
      },
    });

    for (const workflow of activeWorkflows) {
      // TODO: Deactivate workflow in N8N
      await this.prisma.workflow.update({
        where: { id: workflow.id },
        data: { active: false },
      });
    }

    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async listUsers(user: User, organizationId: string) {
    if (user.organizationId !== organizationId) {
      throw new UnauthorizedException('No access to this organization');
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

  private async validateAdminAccess(user: User, organizationId: string) {
    if (user.organizationId !== organizationId || user.role !== 'ADMIN') {
      throw new UnauthorizedException('Admin access required');
    }
  }

  private generateInviteToken(): string {
    return randomBytes(32).toString('hex');
  }
}
