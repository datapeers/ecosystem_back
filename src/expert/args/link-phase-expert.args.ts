import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@ArgsType()
export class LinkExpertsToPhaseArgs {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  phaseId: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  name: string;

  @IsNotEmpty()
  @Field(() => [String])
  experts: string[];
}
