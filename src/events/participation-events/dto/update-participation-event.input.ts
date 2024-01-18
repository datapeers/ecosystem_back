import { CreateParticipationEventInput } from './create-participation-event.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';
/**
 * graphql input scheme
 */
@InputType()
export class UpdateParticipationEventInput extends PartialType(
  CreateParticipationEventInput,
) {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  metadata?: Record<string, any>;
}
