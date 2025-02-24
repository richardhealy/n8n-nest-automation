import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '../../auth/types/user-role.enum';
import type { InviteUserDto } from '../dto/invite-user.dto';
import type { UpdateUserRoleDto } from '../dto/update-user-role.dto';
import { UserManagementService } from '../services/user-management.service';

@Controller('users')
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
    return this.userManagementService.inviteUser(
      user,
      organizationId,
      inviteDto,
    );
  }

  @Patch(':userId/role')
  @Roles(UserRole.ADMIN)
  updateUserRole(
    @GetUser() user: User,
    @Param('organizationId') organizationId: string,
    @Param('userId') userId: string,
    @Body() updateDto: UpdateUserRoleDto,
  ) {
    return this.userManagementService.updateUserRole(
      user,
      organizationId,
      userId,
      updateDto,
    );
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
