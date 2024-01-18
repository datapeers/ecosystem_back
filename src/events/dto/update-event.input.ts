import {
  CreateEventInput,
  ExpertEventSubmit,
  ParticipantEventSubmit,
  TeamCoachSubmit,
} from './create-event.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';
/**
 * graphql input scheme
 */
@InputType()
export class UpdateEventInput extends PartialType(CreateEventInput) {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  extra_options?: Record<string, any>;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  startAt: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  endAt: Date;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isDeleted?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isCanceled?: boolean;

  @Field(() => [ExpertEventSubmit], { nullable: true })
  @IsOptional()
  experts?: ExpertEventSubmit[];

  @Field(() => [TeamCoachSubmit], { nullable: true })
  @IsOptional()
  teamCoaches?: TeamCoachSubmit[];

  @Field(() => [ParticipantEventSubmit], { nullable: true })
  @IsOptional()
  participants?: ParticipantEventSubmit[];
}
