import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import type { User, Workflow } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateWorkflowDto } from '../dto/create-workflow.dto';
import { N8nService } from '../n8n.service';

type PrismaJson = Prisma.InputJsonValue;

@Injectable()
export class WorkflowService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly n8nService: N8nService,
  ) {}

  async create(
    user: User,
    createWorkflowDto: CreateWorkflowDto,
  ): Promise<Workflow> {
    
    // Create workflow in N8N first
    const n8nWorkflow = await this.n8nService.createWorkflow(
      user,
      createWorkflowDto,
    );

    // Then create in our database with the N8N workflow ID
    return this.prisma.workflow.create({
      data: {
        name: createWorkflowDto.name,
        description: createWorkflowDto.description,
        config: {
          nodes: createWorkflowDto.nodes,
          connections: createWorkflowDto.connections,
          n8nWorkflowId: n8nWorkflow.id,
        } as unknown as PrismaJson,
        userId: user.id,
        active: createWorkflowDto.active || false,
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
