import { IsString, IsObject, IsOptional } from 'class-validator';

export class UpdateOrganizationDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsObject()
  @IsOptional()
  whiteLabel?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    domain?: string;
  };
} 