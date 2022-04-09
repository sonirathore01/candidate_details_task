import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserDetailsDto {
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

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
