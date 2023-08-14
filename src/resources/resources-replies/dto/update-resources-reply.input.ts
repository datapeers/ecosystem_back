import { IsNotEmpty, IsOptional } from 'class-validator';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-scalars';
import { CreateResourcesReplyInput } from './create-resources-reply.input';

@InputType()
export class UpdateResourcesReplyInput extends PartialType(
  CreateResourcesReplyInput,
) {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  state?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  item?: Record<string, any>;
}
