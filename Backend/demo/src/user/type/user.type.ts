import { ObjectType, Field, ID } from '@nestjs/graphql';
import {IsOptional} from 'class-validator'

@ObjectType('Address')
export class AddressType {
  @Field(type => ID, {nullable : true})
  _id?: string;

  @Field()
  addressLine1: string;

  @Field({ nullable: true })
  @IsOptional()
  addressLine2?: string;

  @Field()
  country: string;

  @Field()
  city: string;

  @Field()
  province: string;

  @Field()
  postalCode: string;
  
}


@ObjectType('socialProfile')
export class socialProfileType {
  @Field({nullable:true})
  linkedin?: string;
  @Field({nullable:true})
  facebook?: string;
  @Field({nullable:true})
  twitter?: string;
}

@ObjectType('phoneNumber')
export class phoneNumberType {
  @Field()
  countryCode: string
  @Field()
  number: string;
}

@ObjectType('User')
export class UserType {
  @Field(type => ID)
  _id: string;
  
  @Field()
  identifierNumber: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  emailAddress: string;

  @Field(type => phoneNumberType)
  phoneNumber: string;
 
  @Field(type => AddressType)
  address: string;

  @Field(type => socialProfileType , {nullable : true})
  socialProfile?: string;
}


@ObjectType('DeleteUser')
export class DeleteUser {
  @Field()
  message: string
}






