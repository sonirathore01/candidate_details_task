import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../schema/user.schema';
import { AddressDetailsDto } from '../dto/address-details.dto';
import { Address } from '../schema/address.schema';
import { SocialProfileSchema } from '../schema/social-profile.schema';
import { SocialMediaProfileDetailsDto } from '../dto/social-media-profile-details.dto';
import { PhoneNumberDetailsDto } from '../dto/phone-number-details.dto';
import {PhoneNumberSchema} from "../schema/phone-number.schema";

export class UserMapper {
  public static toDomain(data: any, address): User {
    const dto = new User();
    dto.identifierNumber = data.identifierNumber;
    dto.firstName = data.firstName;
    dto.lastName = data.lastName;
    dto.emailAddress = data.emailAddress;
    dto.phoneNumber = this.toPhoneNumber(data.phoneNumber);
    dto.address = address;
    dto.socialProfile = this.toSocialProfile(data.socialProfile);

    return dto;
  }

  public static toAddressDto(
    data: AddressDetailsDto,
    addressId?: string,
  ): Address {
    const dto = new Address();
    dto.addressLine1 = data.addressLine1;
    dto.addressLine2 = data.addressLine2;
    dto.country = data.country;
    dto.city = data.city;
    dto.province = data.province;
    dto.postalCode = data.postalCode;
    dto._id = addressId;

    return dto;
  }

  public static toSocialProfile(
    data: SocialMediaProfileDetailsDto,
  ): SocialProfileSchema {
    const dto = new SocialProfileSchema();
    dto.linkedin = data.linkedin;
    dto.twitter = data.twitter;
    dto.facebook = data.facebook;

    return dto;
  }

  public static toPhoneNumber(
      data: PhoneNumberDetailsDto,
  ): PhoneNumberSchema {
    const dto = new PhoneNumberSchema();
    dto.countryCode = data.countryCode;
    dto.number = data.number;

    return dto;
  }
}
