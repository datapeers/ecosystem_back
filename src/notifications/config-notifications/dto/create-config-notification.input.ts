import { InputType, Int, Field } from '@nestjs/graphql';
/**
 * graphql input scheme
 */
@InputType()
export class CreateConfigNotificationInput {
  @Field(() => String)
  type: string;

  @Field(() => [String])
  excluded: string[];
}
