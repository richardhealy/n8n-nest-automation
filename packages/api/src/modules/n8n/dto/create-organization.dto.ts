import { IsString, IsObject, IsOptional } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  name: string = '';

  @IsObject()
  @IsOptional()
  whiteLabel?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    domain?: string;
  };
} 