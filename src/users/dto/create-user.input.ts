import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {

  @Field( () => String, { nullable: true } )
  uid: string;

  @Field( () => String, { nullable: true })
  fullName: string;

  @Field( () => String, { nullable: true } )
  email: string;

  @Field( () => String, { nullable: true })
  profileImageUrl?: string;

  @Field(() => [String], { nullable: true })
  roles: string[];
}
