import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../auth/types/user-role.enum';
import type { CreateTemplateDto } from './dto/create-template.dto';
import type { CreateWebhookDto } from './dto/create-webhook.dto';
import type { CreateWorkflowDto } from './dto/create-workflow.dto';
import type { ListTemplateDto } from './dto/list-template.dto';
import type { ListWorkflowDto } from './dto/list-workflow.dto';
import type { UpdateWebhookDto } from './dto/update-webhook.dto';
import type { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { N8nService } from './n8n.service';
import { TemplatePresetService } from './services/template-preset.service';
import { WorkflowService } from './services/workflow.service';

@Controller('n8n')
@UseGuards(JwtAuthGuard, RolesGuard)
export class N8nController {
  constructor(
    private readonly n8nService: N8nService,
    private readonly templatePresetService: TemplatePresetService,
    private readonly workflowService: WorkflowService,
  ) {}

  @Post('templates')
  @Roles(UserRole.ADMIN)
  async createTemplate(
    @GetUser() user: User,
    @Body() createTemplateDto: CreateTemplateDto,
  ) {
    return this.n8nService.createTemplate(user, createTemplateDto);
  }

  @Get('templates/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getTemplate(@GetUser() user: User, @Param('id') id: string) {
    return this.n8nService.getTemplate(user, id);
  }

  @Post('templates/:id/workflows')
  async createWorkflowFromTemplate(
    @GetUser() user: User,
    @Param('id') templateId: string,
  ) {
    return this.n8nService.createWorkflowFromTemplate(user, templateId);
  }

  @Post('workflows')
  createWorkflow(@GetUser() user: User, @Body() dto: CreateWorkflowDto) {
    return this.n8nService.createWorkflow(user, dto);
  }

  @Post('templates/:id/duplicate')
  duplicateTemplate(@GetUser() user: User, @Param('id') templateId: string) {
    return this.n8nService.duplicateTemplate(user, templateId);
  }

  @Get('presets')
  @Roles(UserRole.ADMIN, UserRole.USER)
  getPresets() {
    return this.templatePresetService.getAvailablePresets();
  }

  @Post('presets/:preset')
  @Roles(UserRole.ADMIN)
  createFromPreset(
    @GetUser() user: User,
    @Param('preset') preset:
      | 'whatsapp'
      | 'openai'
      | 'googleCalendar'
      | 'emailAutomation',
    @Body() data: { name: string; description: string },
  ) {
    return this.templatePresetService.createFromPreset(
      user,
      preset,
      data.name,
      data.description,
    );
  }

  @Post('workflows/:id/activate')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async activateWorkflow(
    @GetUser() user: User,
    @Param('id') workflowId: string,
  ) {
    return this.n8nService.activateWorkflow(user, workflowId);
  }

  @Post('workflows/:id/deactivate')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async deactivateWorkflow(
    @GetUser() user: User,
    @Param('id') workflowId: string,
  ) {
    return this.n8nService.deactivateWorkflow(user, workflowId);
  }

  @Get('workflows/:id/status')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getWorkflowStatus(
    @GetUser() user: User,
    @Param('id') workflowId: string,
  ) {
    return this.n8nService.getWorkflowStatus(user, workflowId);
  }

  @Post('workflows/:id/execute')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async executeWorkflow(
    @GetUser() user: User,
    @Param('id') workflowId: string,
  ) {
    return this.n8nService.startExecution(user, workflowId);
  }

  @Get('workflows/:id/executions')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getWorkflowExecutions(
    @GetUser() user: User,
    @Param('id') workflowId: string,
  ) {
    return this.n8nService.getWorkflowExecutions(user, workflowId);
  }

  @Get('executions/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getExecution(@GetUser() user: User, @Param('id') executionId: string) {
    return this.n8nService.getExecution(user, executionId);
  }

  @Get('workflows')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async listWorkflows(
    @GetUser() user: User,
    @Query() filters: ListWorkflowDto,
  ) {
    return this.n8nService.listWorkflows(user, filters);
  }

  @Get('workflows/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getWorkflow(@GetUser() user: User, @Param('id') id: string) {
    return this.n8nService.getWorkflow(user, id);
  }

  @Patch('workflows/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async updateWorkflow(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateDto: UpdateWorkflowDto,
  ) {
    return this.n8nService.updateWorkflow(user, id, updateDto);
  }

  @Delete('workflows/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async deleteWorkflow(@GetUser() user: User, @Param('id') id: string) {
    return this.n8nService.deleteWorkflow(user, id);
  }

  @Get('templates')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async listTemplates(
    @GetUser() user: User,
    @Query() filters: ListTemplateDto,
  ) {
    return this.n8nService.listTemplates(user, filters);
  }

  @Patch('templates/:id')
  @Roles(UserRole.ADMIN)
  async updateTemplate(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateTemplateDto>,
  ) {
    return this.n8nService.updateTemplate(user, id, updateDto);
  }

  @Delete('templates/:id')
  @Roles(UserRole.ADMIN)
  async deleteTemplate(@GetUser() user: User, @Param('id') id: string) {
    return this.n8nService.deleteTemplate(user, id);
  }

  @Get('templates/:id/stats')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getTemplateStats(@GetUser() user: User, @Param('id') id: string) {
    return this.n8nService.getTemplateStats(user, id);
  }

  @Post('workflows/:id/webhooks')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async createWebhook(
    @GetUser() user: User,
    @Param('id') workflowId: string,
    @Body() createWebhookDto: CreateWebhookDto,
  ) {
    return this.n8nService.createWebhook(user, {
      ...createWebhookDto,
      workflowId,
    });
  }

  @Get('workflows/:id/webhooks')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getWorkflowWebhooks(
    @GetUser() user: User,
    @Param('id') workflowId: string,
  ) {
    return this.n8nService.getWorkflowWebhooks(user, workflowId);
  }

  @Patch('webhooks/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async updateWebhook(
    @GetUser() user: User,
    @Param('id') webhookId: string,
    @Body() updateDto: UpdateWebhookDto,
  ) {
    return this.n8nService.updateWebhook(user, webhookId, updateDto);
  }

  @Delete('webhooks/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async deleteWebhook(@GetUser() user: User, @Param('id') webhookId: string) {
    return this.n8nService.deleteWebhook(user, webhookId);
  }
}
