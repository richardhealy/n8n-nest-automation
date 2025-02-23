import { IsEmail, IsEnum } from 'class-validator';
import { UserRole } from '../../auth/types/user-role.enum';

export class InviteUserDto {
	@IsEmail()
	email = '';

	@IsEnum(UserRole)
	role: UserRole = UserRole.USER;
}
