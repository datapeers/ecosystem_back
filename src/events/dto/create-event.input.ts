import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';

@InputType()
export class CreateEventInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  type: string;

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
  phase: string;

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

@InputType()
export class TeamCoachSubmit {
  @Field(() => String)
  @IsNotEmpty()
  _id: string;

  @Field(() => String)
  @IsNotEmpty()
  name: string;
}

@InputType()
export class ExpertEventSubmit {
  @Field(() => String)
  @IsNotEmpty()
  _id: string;

  @Field(() => String)
  @IsNotEmpty()
  name: string;
}

@InputType()
export class ParticipantEventSubmit {
  @Field(() => String)
  @IsNotEmpty()
  _id: string;

  @Field(() => String)
  @IsNotEmpty()
  name: string;
}
