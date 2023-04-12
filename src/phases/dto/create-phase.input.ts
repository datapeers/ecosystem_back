import { InputType, Int, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class CreatePhaseInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  childrenOf?: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  thumbnail?: string;

  @Field(() => Date)
  startAt: Date;

  @Field(() => Date)
  endAt: Date;
}
