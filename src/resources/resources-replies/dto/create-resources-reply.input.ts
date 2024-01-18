import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';
/**
 * graphql input scheme
 */
@InputType()
export class CreateResourcesReplyInput {
  @Field(() => GraphQLJSONObject)
  @IsOptional()
  item: Record<string, any>;

  @Field(() => String)
  @IsNotEmpty()
  phase: string;

  @Field(() => String)
  @IsNotEmpty()
  startup: string;

  @Field(() => String)
  @IsNotEmpty()
  resource: string;

  @Field(() => String)
  @IsNotEmpty()
  sprint: string;

  @Field(() => String)
  @IsNotEmpty()
  type: string;

  @Field(() => String)
  @IsNotEmpty()
  state: string;
}
