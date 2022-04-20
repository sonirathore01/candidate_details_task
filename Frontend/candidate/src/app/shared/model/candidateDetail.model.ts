export interface UserModel {
  identifierNumber: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: number;
  address?: AddressModel;
  socialMediaProfile?: SocialMediaProfileModel;
  _id?: string;
}

export interface AddressModel {
  addressLine1: string;
  addressLine2: string;
  country: string;
  city: string;
  province: string;
  postalCode: number;
  _id?: string
  __v?: number
}

export interface SocialMediaProfileModel {
  linkedin: string;
  facebook: string;
  twitter: string;
}
