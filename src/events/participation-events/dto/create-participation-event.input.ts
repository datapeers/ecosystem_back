import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';
/**
 * graphql input scheme
 */
@InputType()
export class CreateParticipationEventInput {
  @Field(() => String)
  @IsNotEmpty()
  participant: string;

  @Field(() => String)
  @IsNotEmpty()
  startup: string;

  @Field(() => String)
  @IsNotEmpty()
  event: string;

  @Field(() => GraphQLJSONObject)
  @IsOptional()
  metadata: Record<string, any>;
}
