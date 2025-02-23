import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
	@IsEmail()
	email = '';

	@IsString()
	@MinLength(6)
	password = '';

	@IsString()
	@IsOptional()
	organizationId?: string;
}
