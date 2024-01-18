import { Field, ArgsType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApplicationStates } from '../enums/application-states.enum';
import { AnnouncementTargets } from 'src/announcements/enums/announcement-targets.enum';
import GraphQLJSON from 'graphql-type-json';
/**
 * graphql args input
 */
@ArgsType()
export class SelectApplicantsArgs {
  @Field(() => String)
  @IsNotEmpty()
  idApplicant: string;

  @Field(() => AnnouncementTargets)
  @IsEnum(AnnouncementTargets)
  typeApplicant: AnnouncementTargets;

  @Field(() => String)
  @IsNotEmpty()
  idBatch: string;

  @Field(() => String)
  @IsNotEmpty()
  nameBatch: string;

  @Field(() => GraphQLJSON)
  @IsOptional()
  metadata: Record<string, any>;
}
