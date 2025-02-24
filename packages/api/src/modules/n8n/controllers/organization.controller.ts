import {
	Body,
	Controller,
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
import type { CreateOrganizationDto } from '../dto/create-organization.dto';
import type { UpdateOrganizationDto } from '../dto/update-organization.dto';
import type { OrganizationService } from '../services/organization.service';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationController {
	constructor(private readonly organizationService: OrganizationService) {}

	@Post()
	@Roles(UserRole.ADMIN)
	create(
		@GetUser() user: User,
		@Body() createOrganizationDto: CreateOrganizationDto,
	) {
		return this.organizationService.create(user.id, createOrganizationDto);
	}

	@Get('current')
	@UseGuards(RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.USER)
	async getCurrentOrganization(@GetUser() user: User) {
		console.log('Controller user:', user);
		return this.organizationService.getOrganization(user, user.organizationId);
	}

	@Get(':id')
	@Roles(UserRole.ADMIN, UserRole.USER)
	getOrganization(@GetUser() user: User, @Param('id') id: string) {
		return this.organizationService.getOrganization(user, id);
	}

	@Patch(':id')
	@Roles(UserRole.ADMIN)
	update(
		@GetUser() user: User,
		@Param('id') id: string,
		@Body() updateDto: UpdateOrganizationDto,
	) {
		return this.organizationService.update(user, id, updateDto);
	}

	@Post(':id/regenerate-api-key')
	@Roles(UserRole.ADMIN)
	regenerateApiKey(@GetUser() user: User, @Param('id') id: string) {
		return this.organizationService.regenerateApiKey(user, id);
	}

	@Get(':id/stats')
	@Roles(UserRole.ADMIN)
	getStats(@GetUser() user: User, @Param('id') id: string) {
		return this.organizationService.getStats(user, id);
	}
}
