import { CreateTypesEventInput } from './create-types-event.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';
@InputType()
export class UpdateTypesEventInput extends PartialType(CreateTypesEventInput) {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  extra_options?: Record<string, any>;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isDeleted?: boolean;

  @Field(() => Boolean, { nullable: false })
  @IsOptional()
  expertFocus?: boolean;
}
