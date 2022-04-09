import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../schema/user.schema';
import { AddressDetailsDto } from '../dto/address-details.dto';
import { Address } from '../schema/address.schema';
import { SocialProfileSchema } from '../schema/social-profile.schema';
import { SocialMediaProfileDetailsDto } from '../dto/social-media-profile-details.dto';

export class UserMapper {
  public static toDomain(data: any, address): User {
    const dto = new User();
    dto.identifierNumber = data.user.identifierNumber;
    dto.firstName = data.user.firstName;
    dto.lastName = data.user.lastName;
    dto.emailAddress = data.user.emailAddress;
    dto.phoneNumber = data.user.phoneNumber;
    dto.address = address;
    dto.socialProfile = this.toSocialProfile(data.socialMediaProfile);

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
}
