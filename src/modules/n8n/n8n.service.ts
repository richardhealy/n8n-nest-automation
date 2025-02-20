import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { Template, WorkflowConfig } from './types/workflow.types';
import axios from 'axios';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { User, Workflow } from '@prisma/client';
import { WorkflowExecutionStatus } from './types/workflow-execution.enum';
import { UpdateWorkflowExecutionDto } from './dto/workflow-execution.dto';
import { ListWorkflowDto } from './dto/list-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { Logger } from '@nestjs/common';
import { ListTemplateDto } from './dto/list-template.dto';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { WorkflowEventsGateway } from './gateways/workflow-events.gateway';

interface WebhookPayload {
  n8nWebhookId: string;
  name: string;
  method: string;
  path: string;
}

@Injectable()
export class N8nService {
  private readonly logger = new Logger(N8nService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly eventsGateway: WorkflowEventsGateway,
  ) {}

  async createTemplate(user: User, createTemplateDto: CreateTemplateDto): Promise<Template> {
    const template = await this.prisma.template.create({
      data: {
        name: createTemplateDto.name,
        description: createTemplateDto.description,
        tags: createTemplateDto.tags,
        config: createTemplateDto.config as Record<string, any>,
        user: { connect: { id: user.id } },
        organization: { connect: { id: user.organizationId } }
      },
      include: {
        organization: true,
        user: true
      }
    });

    return {
      ...template,
      config: template.config as unknown as WorkflowConfig
    };
  }

  private async validateOrganizationAccess(user: User, templateId: string) {
    const template = await this.prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template || template.organizationId !== user.organizationId) {
      throw new UnauthorizedException('No access to this template');
    }

    return template;
  }

  async getTemplate(user: User, id: string): Promise<Template> {
    const template = await this.validateOrganizationAccess(user, id);
    return {
      ...template,
      config: template.config as unknown as WorkflowConfig
    };
  }

  async createWorkflowFromTemplate(
    user: User,
    templateId: string,
  ): Promise<WorkflowConfig> {
    const template = await this.getTemplate(user, templateId);

    const response = await axios.post<WorkflowConfig>(
      `${this.config.get<string>('N8N_API_URL')}/workflows`,
      {
        name: template.name,
        nodes: template.config.nodes,
        connections: template.config.connections,
        active: false,
        organizationId: user.organizationId,
      },
      {
        headers: {
          'X-N8N-API-KEY': this.config.get<string>('N8N_API_KEY'),
        },
      },
    );

    return response.data;
  }

  async createWorkflow(user: User, dto: CreateWorkflowDto) {
    return this.prisma.workflow.create({
      data: {
        name: dto.name,
        description: dto.description,
        config: dto.config,
        userId: user.id,
      },
    });
  }

  async duplicateTemplate(user: User, templateId: string) {
    const template = await this.getTemplate(user, templateId);

    return this.prisma.workflow.create({
      data: {
        name: `Copy of ${template.name}`,
        description: template.description,
        config: template.config,
        userId: user.id,
      },
    });
  }

  async activateWorkflow(_user: User, workflowId: string) {

    try {
      // Activate workflow in N8N
      await axios.post(
        `${this.config.get<string>('N8N_API_URL')}/workflows/${workflowId}/activate`,
        {},
        {
          headers: {
            'X-N8N-API-KEY': this.config.get<string>('N8N_API_KEY'),
          },
        },
      );

      // Update workflow status in database
      const updatedWorkflow = await this.prisma.workflow.update({
        where: { id: workflowId },
        data: { active: true },
      });

      // Notify subscribers about workflow status update
      this.eventsGateway.notifyWorkflowStatus(workflowId, true);

      return updatedWorkflow;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to activate workflow: ${error.message}`);
      }
    }
  }

  async deactivateWorkflow(_user: User, workflowId: string) {
    
    try {
      // Deactivate workflow in N8N
      await axios.post(
        `${this.config.get<string>('N8N_API_URL')}/workflows/${workflowId}/deactivate`,
        {},
        {
          headers: {
            'X-N8N-API-KEY': this.config.get<string>('N8N_API_KEY'),
          },
        },
      );

      // Update workflow status in database
      const updatedWorkflow = await this.prisma.workflow.update({
        where: { id: workflowId },
        data: { active: false },
      });

      // Notify subscribers about workflow status update
      this.eventsGateway.notifyWorkflowStatus(workflowId, false);

      return updatedWorkflow;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to deactivate workflow: ${error.message}`);
      }
    }
  }

  async validateWorkflowAccess(user: User, workflowId: string): Promise<Workflow> {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    if (workflow.userId !== user.id) {
      throw new UnauthorizedException('No access to this workflow');
    }

    return workflow;
  }

  async startExecution(user: User, workflowId: string) {
    await this.validateWorkflowAccess(user, workflowId);

    const execution = await this.prisma.workflowExecution.create({
      data: {
        workflowId,
        status: WorkflowExecutionStatus.RUNNING,
      },
    });

    try {
      // Start workflow in N8N
      await axios.post(
        `${this.config.get<string>('N8N_API_URL')}/workflows/${workflowId}/execute`,
        {},
        {
          headers: {
            'X-N8N-API-KEY': this.config.get<string>('N8N_API_KEY'),
          },
        },
      );

      return execution;
    } catch (error) {
      // Update execution status if start fails
      await this.updateExecution(execution.id, {
        status: WorkflowExecutionStatus.FAILED,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async updateExecution(executionId: string, updateDto: UpdateWorkflowExecutionDto) {
    const execution = await this.prisma.workflowExecution.update({
      where: { id: executionId },
      data: {
        status: updateDto.status,
        error: updateDto.error,
        result: updateDto.result,
        finishedAt: [WorkflowExecutionStatus.COMPLETED, WorkflowExecutionStatus.FAILED].includes(updateDto.status)
          ? new Date()
          : undefined,
      },
      include: {
        workflow: true,
      },
    });

    // Notify subscribers about execution update
    this.eventsGateway.notifyWorkflowExecution(execution.workflowId, {
      executionId,
      status: updateDto.status,
      error: updateDto.error,
      result: updateDto.result,
    });

    return execution;
  }

  async getWorkflowExecutions(user: User, workflowId: string) {
    await this.validateWorkflowAccess(user, workflowId);

    return this.prisma.workflowExecution.findMany({
      where: { workflowId },
      orderBy: { startedAt: 'desc' },
    });
  }

  async getExecution(user: User, executionId: string) {
    const execution = await this.prisma.workflowExecution.findUnique({
      where: { id: executionId },
      include: { workflow: true },
    });

    if (!execution) {
      throw new NotFoundException('Execution not found');
    }

    if (execution.workflow.userId !== user.id) {
      throw new UnauthorizedException('No access to this execution');
    }

    return execution;
  }

  async getWorkflowStatus(user: User, workflowId: string) {
    const workflow = await this.validateWorkflowAccess(user, workflowId);
    return { active: workflow.active };
  }

  async listWorkflows(user: User, filters: ListWorkflowDto) {
    const where: any = {
      userId: user.id,
    };

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (typeof filters.active === 'boolean') {
      where.active = filters.active;
    }

    return this.prisma.workflow.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        executions: {
          orderBy: { startedAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  async getWorkflow(_user: User, id: string) {
    
    return this.prisma.workflow.findUnique({
      where: { id },
      include: {
        executions: {
          orderBy: { startedAt: 'desc' },
          take: 5,
        },
      },
    });
  }

  async updateWorkflow(user: User, id: string, updateDto: UpdateWorkflowDto) {
    await this.validateWorkflowAccess(user, id);

    return this.prisma.workflow.update({
      where: { id },
      data: updateDto,
    });
  }

  async deleteWorkflow(user: User, id: string) {
    await this.validateWorkflowAccess(user, id);

    // Deactivate in N8N if active
    const workflow = await this.prisma.workflow.findUnique({
      where: { id },
    });

    if (workflow?.active) {
      try {
        await axios.post(
          `${this.config.get<string>('N8N_API_URL')}/workflows/${id}/deactivate`,
          {},
          {
            headers: {
              'X-N8N-API-KEY': this.config.get<string>('N8N_API_KEY'),
            },
          },
        );
      } catch (error) {
        if (error instanceof Error) {
          this.logger.error(`Failed to deactivate workflow in N8N: ${error.message}`);
        }
      }
    }

    // Delete from database
    await this.prisma.workflow.delete({
      where: { id },
    });

    return { success: true };
  }

  async listTemplates(user: User, filters: ListTemplateDto) {
    const where: any = {
      organizationId: user.organizationId,
    };

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.tag) {
      where.tags = {
        has: filters.tag,
      };
    }

    return this.prisma.template.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async updateTemplate(
    user: User,
    templateId: string,
    updateDto: Partial<CreateTemplateDto>,
  ) {
    await this.validateOrganizationAccess(user, templateId);

    return this.prisma.template.update({
      where: { id: templateId },
      data: {
        ...updateDto,
        config: updateDto.config as Record<string, any>,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteTemplate(user: User, templateId: string) {
    await this.validateOrganizationAccess(user, templateId);

    // Check if template is in use
    const workflowCount = await this.prisma.workflow.count({
      where: {
        config: {
          path: ['templateId'],
          equals: templateId,
        },
      },
    });

    if (workflowCount > 0) {
      throw new UnauthorizedException('Template is in use by workflows');
    }

    await this.prisma.template.delete({
      where: { id: templateId },
    });

    return { success: true };
  }

  async getTemplateStats(user: User, templateId: string) {
    await this.validateOrganizationAccess(user, templateId);

    const workflowCount = await this.prisma.workflow.count({
      where: {
        config: {
          path: ['templateId'],
          equals: templateId,
        },
      },
    });

    const activeWorkflowCount = await this.prisma.workflow.count({
      where: {
        config: {
          path: ['templateId'],
          equals: templateId,
        },
        active: true,
      },
    });

    return {
      totalWorkflows: workflowCount,
      activeWorkflows: activeWorkflowCount,
    };
  }

  async createWebhook(user: User, createWebhookDto: CreateWebhookDto) {
    // Validate workflow access
    await this.validateWorkflowAccess(user, createWebhookDto.workflowId);

    // Create webhook in N8N
    const n8nWebhook = await axios.post(
      `${this.config.get<string>('N8N_API_URL')}/workflows/${createWebhookDto.workflowId}/webhooks`,
      {
        name: createWebhookDto.name,
        method: createWebhookDto.method,
        path: createWebhookDto.path,
        headers: createWebhookDto.headers,
      },
      {
        headers: {
          'X-N8N-API-KEY': this.config.get<string>('N8N_API_KEY'),
        },
      },
    );

    // Store webhook in database
    return this.prisma.webhookEvent.create({
      data: {
        workflowId: createWebhookDto.workflowId,
        event: 'CREATED',
        payload: {
          name: createWebhookDto.name,
          method: createWebhookDto.method,
          path: createWebhookDto.path,
          n8nWebhookId: n8nWebhook.data.id,
        },
      },
      include: {
        workflow: true,
      },
    });
  }

  async updateWebhook(
    user: User,
    webhookId: string,
    updateDto: UpdateWebhookDto,
  ) {
    const webhook = await this.prisma.webhookEvent.findUnique({
      where: { id: webhookId },
      include: { workflow: true },
    });

    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    await this.validateWorkflowAccess(user, webhook.workflowId);

    if (!webhook?.payload || typeof webhook.payload !== 'object') {
      throw new Error('Invalid webhook payload');
    }

    const payload = webhook.payload as unknown as WebhookPayload;

    // Update webhook in N8N
    await axios.patch(
      `${this.config.get<string>('N8N_API_URL')}/webhooks/${payload.n8nWebhookId}`,
      updateDto,
      {
        headers: {
          'X-N8N-API-KEY': this.config.get<string>('N8N_API_KEY'),
        },
      },
    );

    // Update webhook in database
    return this.prisma.webhookEvent.update({
      where: { id: webhookId },
      data: {
        payload: {
          ...payload,
          ...updateDto,
        },
      },
      include: {
        workflow: true,
      },
    });
  }

  async deleteWebhook(user: User, webhookId: string) {
    const webhook = await this.prisma.webhookEvent.findUnique({
      where: { id: webhookId },
      include: { workflow: true },
    });

    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    if (!webhook.payload || typeof webhook.payload !== 'object') {
      throw new Error('Invalid webhook payload');
    }

    const payload = webhook.payload as unknown as WebhookPayload;

    await this.validateWorkflowAccess(user, webhook.workflowId);

    // Delete webhook from N8N
    await axios.delete(
      `${this.config.get<string>('N8N_API_URL')}/webhooks/${payload.n8nWebhookId}`,
      {
        headers: {
          'X-N8N-API-KEY': this.config.get<string>('N8N_API_KEY'),
        },
      },
    );

    // Delete webhook from database
    await this.prisma.webhookEvent.delete({
      where: { id: webhookId },
    });

    return { success: true };
  }

  async getWorkflowWebhooks(user: User, workflowId: string) {
    await this.validateWorkflowAccess(user, workflowId);

    return this.prisma.webhookEvent.findMany({
      where: {
        workflowId,
        event: 'CREATED',
      },
      include: {
        workflow: true,
      },
    });
  }

  async executeWorkflow(workflowId: string, data: Record<string, any>) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    // Execute workflow in N8N with data
    await axios.post(
      `${this.config.get<string>('N8N_API_URL')}/workflows/${workflowId}/execute`,
      {
        data,
      },
      {
        headers: {
          'X-N8N-API-KEY': this.config.get<string>('N8N_API_KEY'),
        },
      },
    );
  }
} 