import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateActivitiesConfigInput } from './create-activities-config.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-scalars';
import { IActivities, activities } from '../entities/activities-config.entity';
import { Type } from 'class-transformer';

@InputType()
export class UpdateActivitiesConfigInput extends PartialType(
  CreateActivitiesConfigInput,
) {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  limit?: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isDeleted?: boolean;

  @Field(() => [ActivitySetup], { nullable: true })
  @Type(() => ActivitySetup)
  @IsOptional()
  activities: ActivitySetup[];

  @Field(() => [AssignSetup], { nullable: true })
  @Type(() => AssignSetup)
  @IsOptional()
  experts: AssignSetup[];

  @Field(() => [AssignSetup], { nullable: true })
  @Type(() => AssignSetup)
  @IsOptional()
  teamCoaches: AssignSetup[];

  @Field(() => [startUpHoursSetup], { nullable: true })
  @Type(() => startUpHoursSetup)
  @IsOptional()
  startups: startUpHoursSetup[];
}

@InputType()
class ActivitySetup implements IActivities {
  @Field(() => String)
  @IsDefined()
  idActivity: string;

  @Field(() => Int)
  @IsDefined()
  limit: number;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsDefined()
  options: Record<string, any>;
}

@InputType()
class AssignSetup {
  @Field(() => String)
  @IsDefined()
  from: string;

  @Field(() => Int)
  @IsDefined()
  limit: number;
}

@InputType()
class startUpHoursSetup {
  @Field(() => String)
  @IsDefined()
  id: string;

  @Field(() => String)
  @IsDefined()
  from: string;

  @Field(() => Int)
  @IsDefined()
  limit: number;
}
