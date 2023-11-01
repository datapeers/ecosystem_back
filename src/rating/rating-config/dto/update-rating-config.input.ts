import { CreateRatingConfigInput } from './create-rating-config.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRatingConfigInput extends PartialType(CreateRatingConfigInput) {
  @Field(() => Int)
  id: number;
}
