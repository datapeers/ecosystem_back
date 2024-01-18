import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateActivitiesConfigInput } from './create-activities-config.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IActivities, IAssign } from '../entities/activities-config.entity';
import { Type } from 'class-transformer';

/**
 * graphql input scheme
 * only updates the fields for limit, activities, assigned startups, experts, team coaches
 */
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
  startups: AssignSetup[];

  @Field(() => [AssignSetup], { nullable: true })
  @Type(() => AssignSetup)
  @IsOptional()
  experts: AssignSetup[];

  @Field(() => [AssignSetup], { nullable: true })
  @Type(() => AssignSetup)
  @IsOptional()
  teamCoaches: AssignSetup[];
}
/**
 * @ignore
 */
@InputType()
class ActivitySetup implements IActivities {
  @Field(() => String)
  @IsDefined()
  id: string;

  @Field(() => Int)
  @IsDefined()
  limit: number;
}
/**
 * @ignore
 */
@InputType()
class AssignSetup implements IAssign {
  @Field(() => String)
  @IsDefined()
  entityID: string;

  @Field(() => Int)
  @IsDefined()
  limit: number;

  @Field(() => String)
  @IsDefined()
  activityID: string;
}
