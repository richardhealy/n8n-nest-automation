import { IsOptional, IsString } from 'class-validator';

export class ListTemplateDto {
	@IsOptional()
	@IsString()
	search?: string;

	@IsOptional()
	@IsString()
	tag?: string;
}
