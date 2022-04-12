import { IsNotEmpty, IsString } from 'class-validator';

export class PhoneNumberDetailsDto {
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @IsNotEmpty()
  @IsString()
  number: string;
}
