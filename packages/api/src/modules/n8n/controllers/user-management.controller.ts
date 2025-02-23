import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserManagementService } from '../services/user-management.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { UserRole } from '../../auth/types/user-role.enum';
import { InviteUserDto } from '../dto/invite-user.dto';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';

@Controller('organizations/:organizationId/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Post('invite')
  @Roles(UserRole.ADMIN)
  inviteUser(
    @GetUser() user: User,
    @Param('organizationId') organizationId: string,
    @Body() inviteDto: InviteUserDto,
  ) {
    return this.userManagementService.inviteUser(user, organizationId, inviteDto);
  }

  @Patch(':userId/role')
  @Roles(UserRole.ADMIN)
  updateUserRole(
    @GetUser() user: User,
    @Param('organizationId') organizationId: string,
    @Param('userId') userId: string,
    @Body() updateDto: UpdateUserRoleDto,
  ) {
    return this.userManagementService.updateUserRole(user, organizationId, userId, updateDto);
  }

  @Delete(':userId')
  @Roles(UserRole.ADMIN)
  removeUser(
    @GetUser() user: User,
    @Param('organizationId') organizationId: string,
    @Param('userId') userId: string,
  ) {
    return this.userManagementService.removeUser(user, organizationId, userId);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  listUsers(
    @GetUser() user: User,
    @Param('organizationId') organizationId: string,
  ) {
    return this.userManagementService.listUsers(user, organizationId);
  }
} 