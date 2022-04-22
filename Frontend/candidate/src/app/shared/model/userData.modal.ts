export interface userData {
    _id: string,
    identifierNumber: string,
    firstName: string,
    lastName: string,
    emailAddress: string,
    phoneNumber: { countryCode: string, number: string },
    address: {
        _id: string,
        addressLine1: string,
        addressLine2: string,
        country: string,
        city: string,
        province: string,
        postalCode: string,
    },
    socialProfile: { linkedin: string, twitter: string, facebook: string },
}