import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  name = '';

  @IsObject()
  @IsOptional()
  whiteLabel?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    domain?: string;
  };
}
