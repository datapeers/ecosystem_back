import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateFormTagInput {
  @Field(() => String)
  name: string;
}
