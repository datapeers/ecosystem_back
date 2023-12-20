import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateConfigNotificationInput {
  @Field(() => String)
  type: string;

  @Field(() => [String])
  excluded: string[];
}
