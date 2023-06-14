import { CreateEventInput } from './create-event.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';

@InputType()
export class UpdateEventInput extends PartialType(CreateEventInput) {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  extra_options?: Record<string, any>;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  startAt: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  endAt: Date;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isDeleted?: boolean;
}
