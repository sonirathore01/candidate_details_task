import { AddressDetailsDto } from './address-details.dto';
import { SocialMediaProfileDetailsDto } from './social-media-profile-details.dto';
import { PhoneNumberDetailsDto } from './phone-number-details.dto';
import {
  IsDefined, IsEmail, IsNotEmpty,
  IsObject, IsString, MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  identifierNumber: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  
  emailAddress: string;

  @IsDefined()
  @IsObject()
  @Type(() => PhoneNumberDetailsDto)
  @ValidateNested()
  phoneNumber: PhoneNumberDetailsDto;

  @IsDefined()
  @IsObject()
  @Type(() => AddressDetailsDto)
  @ValidateNested()
  address: AddressDetailsDto;

  @IsDefined()
  @IsObject()
  @Type(() => SocialMediaProfileDetailsDto)
  @ValidateNested()
  socialProfile: SocialMediaProfileDetailsDto;
}
