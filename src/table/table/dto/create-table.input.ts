import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
/**
 * graphql inputs
 */
@InputType()
export class CreateTableInput {
  @Field(() => String, {
    description: 'String key used to identify the table by its location.',
  })
  @IsNotEmpty()
  locator: string;

  @Field(() => String, { description: 'Form used by the table.' })
  @IsNotEmpty()
  form: string;
}
