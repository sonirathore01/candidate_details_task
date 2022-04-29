
import {Field, ObjectType, InputType} from '@nestjs/graphql';
import {IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength} from 'class-validator';
import { UserType} from './user.type';

@InputType()
export class GetUserArgs {
  @IsString()
  @Field({ nullable: true })
  search?: string;

  @IsNumber()
  @Field({ nullable: true })
  limit?: number;

  @IsNumber()
  @Field({ nullable: true })
  page?: number;

  @IsString()
  @Field({ nullable: true })
  sortColumn?: string;

  @IsString()
  @Field({ nullable: true})
  sortType?: string;
}

@ObjectType()
export class UserList {
  
    @Field(type => [UserType])
    items: UserType[]

    @Field()
    total: number;
}


@InputType('AddressArg')
export class AddressArg {

  @IsNotEmpty()
  @IsString()
  @Field()
  addressLine1: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  addressLine2?: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  country: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  city: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  province: string;

  @IsOptional()
  @IsString()
  @Field()
  postalCode: string;
  
}


@InputType('socialProfileArg')
export class socialProfileArg {

  @IsOptional()
  @IsString()
  @Field({nullable: true})
  linkedin: string;

  @IsOptional()
  @IsString()
  @Field({nullable:true})
  facebook: string;

  @IsOptional()
  @IsString()
  @Field({nullable:true})
  twitter: string;
}

@InputType('phoneNumberArg')
export class phoneNumberArg {
  @Field()
  @IsNotEmpty()
  @IsString()
  countryCode: string

  @Field()
  @IsNotEmpty()
  @IsString()
  number: string;
}

@InputType()
export class CreateUserArgs {
  @Field({nullable:true})
  _id:string

  @IsString()
  @IsNotEmpty()
  @Field()
  identifierNumber: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @Field()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @Field()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @Field()
  emailAddress: string;

  @Field()
  phoneNumber: phoneNumberArg;
 
  @Field()
  @IsNotEmpty()
  address: AddressArg;

  @IsOptional()
  @Field({nullable : true})
  socialProfile: socialProfileArg;
}

@InputType()
export class UpdateUserArgs extends CreateUserArgs{
}

@InputType() 
export class DeleteUserArg {
  @IsNotEmpty()
  @Field(type => [String])
  ids: [string];
}