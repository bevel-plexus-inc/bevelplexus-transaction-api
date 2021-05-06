import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class Account {
    @Field()
    id: string;

    @Field()
    accountNumber: string;

    @Field()
    userId: string;

    @Field()
    email: string;

    @Field()
    quidaxId: string;

    @Field()
    quidaxSn: string;

    @Field({ nullable: true })
    quidaxReference?: string;

    @Field({ nullable: true })
    quidaxDisplayName?: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field({ nullable: true })
    deletedAt?: Date;
}
