import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreatePhaseInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  childrenOf?: string;

  @Field(() => String)
  @IsNotEmpty()
  stage: string;

  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String, { defaultValue: '' })
  @IsOptional()
  description: string;

  @Field(() => String, { defaultValue: '' })
  @IsOptional()
  landing: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  thumbnail?: string;

  @Field(() => Boolean)
  @IsNotEmpty()
  basePhase: boolean;

  @Field(() => Date)
  @IsNotEmpty()
  startAt: Date;

  @Field(() => Date)
  @IsNotEmpty()
  endAt: Date;
}
