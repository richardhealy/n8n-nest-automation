import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateWorkflowDto } from '../dto/create-workflow.dto';

@Injectable()
export class WorkflowService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User, createWorkflowDto: CreateWorkflowDto) {
    return this.prisma.workflow.create({
      data: {
        name: createWorkflowDto.name,
        description: createWorkflowDto.description,
        config: createWorkflowDto.config || {},
        active: false,
        userId: user.id,
        isTemplate: false,
      },
    });
  }

  async findAll(user: User) {
    return this.prisma.workflow.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  async activate(user: User, id: string) {
    await this.validateAccess(user, id);
    return this.prisma.workflow.update({
      where: { id },
      data: { active: true },
    });
  }

  async deactivate(user: User, id: string) {
    await this.validateAccess(user, id);
    return this.prisma.workflow.update({
      where: { id },
      data: { active: false },
    });
  }

  async remove(user: User, id: string) {
    await this.validateAccess(user, id);
    return this.prisma.workflow.delete({
      where: { id },
    });
  }

  private async validateAccess(user: User, workflowId: string) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    if (workflow.userId !== user.id) {
      throw new UnauthorizedException('No access to this workflow');
    }
  }
} 