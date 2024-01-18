import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RatingService } from './rating.service';
import { Rating } from './entities/rating.entity';
import { CreateRatingInput } from './dto/create-rating.input';
import { UpdateRatingInput } from './dto/update-rating.input';
/**
 * @ignore
 */
@Resolver(() => Rating)
export class RatingResolver {
  constructor(private readonly ratingService: RatingService) {}

  @Mutation(() => Rating)
  createRating(
    @Args('createRatingInput') createRatingInput: CreateRatingInput,
  ) {
    return this.ratingService.create(createRatingInput);
  }

  @Query(() => [Rating], { name: 'rating' })
  findAll() {
    return this.ratingService.findAll();
  }

  @Query(() => Rating, { name: 'rating' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.ratingService.findOne(id);
  }

  @Mutation(() => Rating)
  updateRating(
    @Args('updateRatingInput') updateRatingInput: UpdateRatingInput,
  ) {
    return this.ratingService.update(updateRatingInput.id, updateRatingInput);
  }

  @Mutation(() => Rating)
  removeRating(@Args('id', { type: () => Int }) id: number) {
    return this.ratingService.remove(id);
  }
}
