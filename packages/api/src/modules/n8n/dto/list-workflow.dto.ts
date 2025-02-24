import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ListWorkflowDto {
	@IsOptional()
	@IsString()
	search?: string;

	@IsOptional()
	@IsBoolean()
	active?: boolean;
}
