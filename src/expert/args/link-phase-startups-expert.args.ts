import { ArgsType, InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsDefined } from 'class-validator';
import { StartupLink } from '../entities/expert.entity';
import { Type } from 'class-transformer';
/**
 * graphql args input
 */
@ArgsType()
export class LinkStartupsExpertsArgs {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  expertId: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  phase: string;

  @Field(() => [StartupItem], { nullable: true })
  @Type(() => StartupItem)
  @IsOptional()
  startUps: StartupItem[];
}
/**
 * @ignore
 */
@InputType()
class StartupItem {
  @Field(() => String)
  @IsDefined()
  _id: string;

  @Field(() => String)
  @IsDefined()
  name: string;
}
