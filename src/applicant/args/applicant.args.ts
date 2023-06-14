import { Field, ArgsType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApplicationStates } from '../enums/application-states.enum';

@ArgsType()
export class ApplicantArgs {
  @Field(() => String)
  @IsNotEmpty()
  id: string;

  @Field(() => ApplicationStates)
  @IsEnum(ApplicationStates)
  state: ApplicationStates;
}
