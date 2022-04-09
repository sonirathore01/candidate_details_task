import { UserDetailsDto } from './user-details.dto';
import { AddressDetailsDto } from './address-details.dto';
import { SocialMediaProfileDetailsDto } from './social-media-profile-details.dto';
import {
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsDefined()
  @IsObject()
  @Type(() => UserDetailsDto)
  @ValidateNested()
  user: UserDetailsDto;

  @IsDefined()
  @IsObject()
  @Type(() => AddressDetailsDto)
  @ValidateNested()
  address: AddressDetailsDto;

  @IsDefined()
  @IsObject()
  @Type(() => SocialMediaProfileDetailsDto)
  @ValidateNested()
  socialMediaProfile: SocialMediaProfileDetailsDto;
}
