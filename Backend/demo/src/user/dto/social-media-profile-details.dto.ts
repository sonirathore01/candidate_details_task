import { IsOptional, IsString } from 'class-validator';

export class SocialMediaProfileDetailsDto {
  @IsOptional()
  @IsString()
  linkedin: string;

  @IsOptional()
  @IsString()
  facebook: string;

  @IsOptional()
  @IsString()
  twitter: string;
}
