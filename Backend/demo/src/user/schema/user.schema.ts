import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Address } from './address.schema';
import { SocialProfileSchema } from './social-profile.schema';
import { PhoneNumberSchema } from './phone-number.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  identifierNumber: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  emailAddress: string;

  @Prop()
  phoneNumber: PhoneNumberSchema;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Address' })
  address: Address;

  @Prop()
  socialProfile: SocialProfileSchema;
}

export const UserSchema = SchemaFactory.createForClass(User);
