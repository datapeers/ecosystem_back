import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
/**
 * graphql input scheme
 */
@InputType()
export class CreateRolInput {
  @Field(() => String)
  @IsNotEmpty()
  rol: string;
}
