import { BadRequestException, Injectable } from '@nestjs/common';
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
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    let isEmailUnique = true;
    try {
      console.log(
        'Executing add candidate details with payload: ',
        JSON.stringify(createUserDto),
      );

      const isEmailPresent =  await this.userModel.findOne({emailAddress : createUserDto.emailAddress});
  
      if(isEmailPresent) {
        isEmailUnique = false;
        throw new Error(`This email address is alredy in used`);
      }
      
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

      return result ;
    } catch (e) {
      console.log(e.message);
      if(!isEmailUnique) {
        throw new BadRequestException({field: 'email', message: e.message});  
      }
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    let isEmailUnique = true;

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

        let isEmailPresent =  await this.userModel.findOne({emailAddress : updateUserDto.emailAddress});

      if(userModelExists.emailAddress===updateUserDto.emailAddress){
        isEmailPresent=null
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
          { returnOriginal: false }
        ).populate('address');

      console.log('Successfully updated candidate information');

      return userModel;
    } catch (e) {
     
      if(!isEmailUnique) {
        throw new BadRequestException({field: 'email', message: e.message});  
      }
      
      return e.message
    }
  }

  async list(query): Promise<any> {
    let userModel;
    let search = query.search

    try {
      var limit = parseInt(query.limit);
      var page = parseInt(query.page)
      var skip

      //limit
      limit || (limit = 4);

      if (page) {
        limit;
        skip = (page-1) * limit;
      }
      if (!search) {
        search = '';
      } else {
        search = new RegExp(query.search, 'i')
      }


      const addressId = await this.addressModel.find({
        $or: [
          { addressLine1: { $regex: search } },
          { addressLine2: { $regex: search } },
          { country: { $regex: search } },
          { city: { $regex: search } },
          { province: { $regex: search } },
          { postalCode: { $regex: search } },
        ]
      });

      const id = addressId.map((data: any) => data._id)

      const userData = await this.userModel.find({
        $or: [
          { identifierNumber: { $regex: search } },
          { firstName: { $regex: search } },
          { lastName: { $regex: search } },
          { emailAddress: { $regex: search } },
          { "phoneNumber.number": search },
          { "socialProfile.linkedin": { $regex: search } },
          { "socialProfile.facebook": { $regex: search } },
          { "socialProfile.twitter": { $regex: search } },
          { address: { $in: id } }
        ]
      });

      if (query.sortColumn && query.sortType) {
        let x = {};
        x[query.sortColumn] = query.sortType == 'asc' ? 1 : -1;
        userModel = await this.userModel.find(
            {
              $or: [
                { identifierNumber: { $regex: search } },
                { firstName: { $regex: search } },
                { lastName: { $regex: search } },
                { emailAddress: { $regex: search } },
                { "phoneNumber.number": search },
                { "socialProfile.linkedin": { $regex: search } },
                { "socialProfile.facebook": { $regex: search } },
                { "socialProfile.twitter": { $regex: search } },
                { address: { $in: id } }
              ]
            })
            .populate('address')
            .sort(x)
            .limit((page && limit) || (query?.limit && limit))
            .skip(page && skip);
      } else {
        userModel = await this.userModel.find(
            {
              $or: [
                { identifierNumber: { $regex: search } },
                { firstName: { $regex: search } },
                { lastName: { $regex: search } },
                { emailAddress: { $regex: search } },
                { "phoneNumber.number": search },
                { "socialProfile.linkedin": { $regex: search } },
                { "socialProfile.facebook": { $regex: search } },
                { "socialProfile.twitter": { $regex: search } },
                { address: { $in: id } }
              ]
            })
            .populate('address')
            .limit((page && limit) || (query?.limit && limit))
            .skip(page && skip);
      }

      if (!userModel || !userModel.length) {
        throw new NotFoundError(`Candidates were not found.`);
      }

      console.log('Successfully lists the candidate information');

      return { items: userModel, total: userData.length };
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

  async deleteMany(ids:any):Promise<any>  {
    try {
      await ids.map(async (id)=>{
        const userData = await this.userModel.findById(id);
        const addressId = userData.address.toString();
        await userData.delete();
        const address = await this.addressModel.findByIdAndDelete(addressId)
      });
      return {message :  "Data successfully deleted" }
    } catch (e) {
      console.log(
          'There was an error while deleting the candidate information. Error Message: ',
          e.message,
          '\n Stack: ',
          e.stack,
      );
      return e.message;
    }
  }
  
}
