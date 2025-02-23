import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WorkflowHistoryService } from '../services/workflow-history.service';
import { WorkflowExecutionHistory, WorkflowSchedule } from '../types/workflow-history.types';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('workflow-history')
@Controller('workflow-history')
@UseGuards(JwtAuthGuard)
export class WorkflowHistoryController {
  constructor(private readonly workflowHistoryService: WorkflowHistoryService) {}

  @Get(':workflowId/history')
  @ApiOperation({ summary: 'Get workflow execution history' })
  @ApiResponse({ status: 200, description: 'Returns workflow execution history' })
  async getWorkflowHistory(
    @Param('workflowId') workflowId: string
  ): Promise<WorkflowExecutionHistory[]> {
    return this.workflowHistoryService.getWorkflowHistory(workflowId);
  }

  @Post('schedule')
  @ApiOperation({ summary: 'Create workflow schedule' })
  @ApiResponse({ status: 201, description: 'Schedule created successfully' })
  async createSchedule(
    @Body() scheduleData: Omit<WorkflowSchedule, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<WorkflowSchedule> {
    return this.workflowHistoryService.createSchedule(scheduleData);
  }

  @Patch('schedule/:id/status')
  @ApiOperation({ summary: 'Update schedule status' })
  @ApiResponse({ status: 200, description: 'Schedule status updated successfully' })
  async updateScheduleStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean
  ): Promise<WorkflowSchedule> {
    return this.workflowHistoryService.updateScheduleStatus(id, isActive);
  }
} 