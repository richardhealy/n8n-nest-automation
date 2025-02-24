import { randomBytes } from 'node:crypto';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, type User } from '@prisma/client';
import type { PrismaService } from '../../prisma/prisma.service';
import type { CreateOrganizationDto } from '../dto/create-organization.dto';
import type { UpdateOrganizationDto } from '../dto/update-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateOrganizationDto) {
    return this.prisma.organization.create({
      data: {
        apiKey: this.generateApiKey(),
        name: data.name,
        whiteLabel: data.whiteLabel
          ? JSON.stringify(data.whiteLabel)
          : Prisma.JsonNull,
        users: {
          connect: { id: userId },
        },
      },
    });
  }

  async update(user: User, id: string, updateDto: UpdateOrganizationDto) {
    await this.validateAccess(user, id);

    return this.prisma.organization.update({
      where: { id },
      data: updateDto,
    });
  }

  async getOrganization(user: User, id: string) {
    await this.validateAccess(user, id);

    return this.prisma.organization.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        templates: {
          select: {
            id: true,
            name: true,
            description: true,
            tags: true,
          },
        },
      },
    });
  }

  async regenerateApiKey(user: User, id: string) {
    await this.validateAccess(user, id);

    const apiKey = this.generateApiKey();

    return this.prisma.organization.update({
      where: { id },
      data: { apiKey },
      select: { apiKey: true },
    });
  }

  async getStats(user: User, id: string) {
    await this.validateAccess(user, id);

    const [userCount, templateCount, workflowCount, activeWorkflowCount] =
      await Promise.all([
        this.prisma.user.count({
          where: { organizationId: id },
        }),
        this.prisma.template.count({
          where: { organizationId: id },
        }),
        this.prisma.workflow.count({
          where: { user: { organizationId: id } },
        }),
        this.prisma.workflow.count({
          where: {
            user: { organizationId: id },
            active: true,
          },
        }),
      ]);

    return {
      users: userCount,
      templates: templateCount,
      workflows: workflowCount,
      activeWorkflows: activeWorkflowCount,
    };
  }

  private async validateAccess(user: User, organizationId: string) {
    if (user.organizationId !== organizationId) {
      throw new UnauthorizedException('No access to this organization');
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  private generateApiKey(): string {
    return `n8n_${randomBytes(32).toString('hex')}`;
  }
}
