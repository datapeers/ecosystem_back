import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateFormTagInput {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  name: string;
}
