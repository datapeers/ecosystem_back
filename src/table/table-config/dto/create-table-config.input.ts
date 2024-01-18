import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
/**
 * graphql inputs
 */
@InputType()
export class CreateTableConfigInput {
  @Field(() => String, {
    description: 'Id of the table the configuration is associated with.',
  })
  @IsNotEmpty()
  table: string;

  @Field(() => String, { description: 'Name of the table configuration.' })
  @IsNotEmpty()
  name: string;
}
