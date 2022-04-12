import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AddressDocument = Address & Document;

@Schema()
export class Address {
  _id: string;
  @Prop()
  addressLine1: string;

  @Prop()
  addressLine2?: string;

  @Prop()
  country: string;

  @Prop()
  city: string;

  @Prop()
  province: string;

  @Prop()
  postalCode: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
