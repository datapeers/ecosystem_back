import { CreateStageInput } from './create-stage.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class UpdateStageInput extends PartialType(CreateStageInput) {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isDeleted?: boolean;
}
