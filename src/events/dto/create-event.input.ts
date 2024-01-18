import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';
/**
 * graphql input scheme
 */
@InputType()
export class CreateEventInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  type: string;

  @Field(() => String)
  @IsNotEmpty()
  attendanceType: string;

  @Field(() => String)
  @IsOptional()
  description?: string;

  @Field(() => Date)
  @IsNotEmpty()
  startAt: Date;

  @Field(() => Date)
  @IsNotEmpty()
  endAt: Date;

  @Field(() => GraphQLJSONObject)
  @IsOptional()
  extra_options: Record<string, any>;

  @Field(() => String)
  @IsNotEmpty()
  batch: string;

  @Field(() => [ExpertEventSubmit])
  @IsOptional()
  experts: ExpertEventSubmit[];

  @Field(() => [TeamCoachSubmit])
  @IsOptional()
  teamCoaches: TeamCoachSubmit[];

  @Field(() => [ParticipantEventSubmit])
  @IsOptional()
  participants: ParticipantEventSubmit[];
}
/**
 * @ignore
 */
@InputType()
export class TeamCoachSubmit {
  @Field(() => String)
  @IsNotEmpty()
  _id: string;

  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  email: string;
}
/**
 * @ignore
 */
@InputType()
export class ExpertEventSubmit {
  @Field(() => String)
  @IsNotEmpty()
  _id: string;

  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  email: string;
}
/**
 * @ignore
 */
@InputType()
export class ParticipantEventSubmit {
  @Field(() => String)
  @IsNotEmpty()
  _id: string;

  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  startupEntrepreneur: string;
}
