import { IsNotEmpty, IsString } from 'class-validator';

export class SocialMediaProfileDetailsDto {
  @IsNotEmpty()
  @IsString()
  linkedin: string;

  @IsNotEmpty()
  @IsString()
  facebook: string;

  @IsNotEmpty()
  @IsString()
  twitter: string;
}
