// eslint-disable-next-line max-classes-per-file
import { Field, ObjectType } from "type-graphql";

@ObjectType()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class UserVerification {
    @Field()
    level: number;

    @Field()
    isEmailVerified: boolean;

    @Field()
    isPhoneNumberVerified: boolean;

    @Field()
    isUtilityBillVerified: boolean;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
class RegularAccountDetail {
    @Field()
    city: string;

    @Field()
    countryId: string;

    @Field()
    address: string;

    @Field()
    postalCode: string;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
class StudentAccountDetail {
    @Field()
    countryId: string;

    @Field()
    institutionId: string;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
class UserKyc {
    @Field()
    isVerified: boolean;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
export default class User {
    @Field()
    id: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field()
    phoneNumber: string;

    @Field()
    userType: string;

    @Field()
    createdAt: string;

    @Field()
    updatedAt: string;

    @Field({ nullable: true })
    deletedAt?: string;

    @Field(returns => UserVerification, { nullable: true })
    userVerification?: UserVerification;

    @Field(returns => RegularAccountDetail, { nullable: true })
    regularAccountDetail?: RegularAccountDetail;

    @Field(returns => StudentAccountDetail, { nullable: true })
    studentAccountDetail?: StudentAccountDetail;

    @Field(returns => UserKyc, { nullable: true })
    userKyc?: UserKyc;
}
