import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class Recipient {
    @Field()
    id: string;

    @Field()
    userId: string;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    phoneNumber: string;

    @Field()
    location: string;

    @Field()
    createdAt: string;

    @Field()
    updatedAt: string;

    @Field({ nullable: true })
    deletedAt?: string;
}
