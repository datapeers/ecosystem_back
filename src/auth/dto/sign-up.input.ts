import { Field, InputType } from "@nestjs/graphql";
import { ValidRoles } from "../enums/valid-roles.enum";

@InputType()
export class SignUpInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true, defaultValue: ValidRoles.user })
  role?: string;
}