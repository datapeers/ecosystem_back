import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class FindUsersInput {
  @Field( () => [String])
  roles: string[];
}