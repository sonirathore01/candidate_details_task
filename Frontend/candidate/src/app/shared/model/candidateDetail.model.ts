export interface CandidateDetailRequestModel {
  user?: UserModel;
  address?: AddressModel;
  socialMediaProfile?: SocialMediaProfileModel;
}

export interface UserModel {
  identifierNumber: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: number;
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

export interface CandidateDetailResponseModel extends UserModel {
  address?: AddressModel;
  socialProfile?: SocialMediaProfileModel;
  _id?: string;
  __v?: number;
}
