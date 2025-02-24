import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../auth/types/user-role.enum';
import type { CreateWorkflowDto } from '../dto/create-workflow.dto';
import { WorkflowService } from '../services/workflow.service';
import { N8nService } from '../n8n.service';

@Controller('workflows')
@UseGuards(JwtAuthGuard)
export class WorkflowController {
  constructor(
    private readonly workflowService: WorkflowService,
    private readonly n8nService: N8nService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  create(@GetUser() user: User, @Body() createWorkflowDto: CreateWorkflowDto) {
    return this.workflowService.create(user, createWorkflowDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  findAll(@GetUser() user: User) {
    return this.workflowService.findAll(user);
  }

  @Post(':id/activate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  activate(@GetUser() user: User, @Param('id') id: string) {
    return this.workflowService.activate(user, id);
  }

  @Post(':id/deactivate')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  deactivate(@GetUser() user: User, @Param('id') id: string) {
    return this.workflowService.deactivate(user, id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.workflowService.remove(user, id);
  }
}
