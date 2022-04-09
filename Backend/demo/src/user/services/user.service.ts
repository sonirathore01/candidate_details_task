import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserMapper } from '../mappers/user-mapper';
import { Address } from '../schema/address.schema';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Address.name)
    private addressModel: Model<Address>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      console.log(
        'Executing add candidate details with payload: ',
        JSON.stringify(createUserDto),
      );
      //Address Model
      const address = UserMapper.toAddressDto(createUserDto.address);
      const addressModel = new this.addressModel(address);

      //User Model
      const user = UserMapper.toDomain(createUserDto, addressModel);
      const userModel = new this.userModel(user);

      await addressModel.save();
      console.log('Successfully saved address information');
      const result = await userModel.save();
      console.log('Successfully saved candidate information');

      return result;
    } catch (e) {
      console.log(
        'There was an error while saving the candidate information. Error Message',
        e.message,
        '\n Stack: ',
        e.stack,
      );
      return e.message;
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      console.log(
        `Candidate: ${userId} | Executing update candidate details with payload: `,
        JSON.stringify(updateUserDto),
      );

      const userModelExists = await this.userModel
        .findById({ _id: userId })
        .populate('address');

      if (!userModelExists) {
        throw new NotFoundError(`User: ${userId} | Candidate was not found.`);
      }

      //Update Address Model
      const address = await this.addressModel.findOneAndUpdate(
        { _id: userModelExists.address._id },
        UserMapper.toAddressDto(updateUserDto.address),
      );

      console.log('Successfully updated address information');

      //Update User Model
      const userModel = await this.userModel
        .findOneAndUpdate(
          { _id: userId },
          UserMapper.toDomain(updateUserDto, address),
        )
        .populate('address');

      console.log('Successfully updated candidate information');

      return userModel;
    } catch (e) {
      console.log(
        'There was an error while updating the candidate information. Error Message: ',
        e.message,
        '\n Stack: ',
        e.stack,
      );
      return e.message;
    }
  }

  async list(): Promise<any> {
    try {
      console.log(`Executing list the candidate details.`);

      const userModel = await this.userModel.find().populate('address');

      if (!userModel || !userModel.length) {
        throw new NotFoundError(`Candidates were not found.`);
      }

      console.log('Successfully lists the candidate information');

      return { items: userModel, total: userModel.length };
    } catch (e) {
      console.log(
        'There was an error while listing the candidate information. Error Message: ',
        e.message,
        '\n Stack: ',
        e.stack,
      );
      return e.message;
    }
  }
}
