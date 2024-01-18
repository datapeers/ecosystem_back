import { Field, ArgsType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApplicationStates } from '../enums/application-states.enum';
/**
 * graphql args input
 */
@ArgsType()
export class ApplicantArgs {
  @Field(() => String)
  @IsNotEmpty()
  id: string;

  @Field(() => ApplicationStates)
  @IsEnum(ApplicationStates)
  state: ApplicationStates;
}
