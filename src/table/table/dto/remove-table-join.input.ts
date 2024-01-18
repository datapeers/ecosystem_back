import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
/**
 * graphql inputs
 */
@InputType()
export class RemoveTableJoinInput {
  @Field(() => String, { description: 'Table id.' })
  @IsNotEmpty()
  id: string;

  @Field(() => String, { description: 'Key of the join to be removed.' })
  @IsNotEmpty()
  key: string;
}
