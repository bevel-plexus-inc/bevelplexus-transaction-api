import { Field, InputType } from "type-graphql";

@InputType()
export default class AccountArgs {
    @Field()
    userId: string;

    @Field()
    email: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string;
}
