import { IsNotEmpty, IsOptional } from 'class-validator';
import { InputType, Field, ID, Int } from '@nestjs/graphql';
/**
 * graphql input scheme
 */
@InputType()
export class UpdatePhaseInput {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  landing?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  thumbnail?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  sidebarImage?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  startAt?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  endAt?: Date;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  index?: number;
}
