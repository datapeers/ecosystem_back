import { CreateRatingConfigInput } from './create-rating-config.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

/**
 * graphql input scheme
 * @ignore
 */
@InputType()
export class UpdateRatingConfigInput extends PartialType(
  CreateRatingConfigInput,
) {
  @Field(() => Int)
  id: number;
}
