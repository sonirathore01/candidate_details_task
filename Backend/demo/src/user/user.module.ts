import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { User, UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema } from './schema/address.schema';
import { UserResolver } from './resolver/user.resolver';

@Module({
  providers: [UserService, UserResolver],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Address.name, schema: AddressSchema },
    ]), 
  ],
})
export class UserModule {}
