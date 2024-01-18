import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RatingConfigService } from './rating-config.service';
import { RatingConfig } from './entities/rating-config.entity';
import { CreateRatingConfigInput } from './dto/create-rating-config.input';
import { UpdateRatingConfigInput } from './dto/update-rating-config.input';
/**
 * @ignore
 */
@Resolver(() => RatingConfig)
export class RatingConfigResolver {
  constructor(private readonly ratingConfigService: RatingConfigService) {}

  @Mutation(() => RatingConfig)
  createRatingConfig(
    @Args('createRatingConfigInput')
    createRatingConfigInput: CreateRatingConfigInput,
  ) {
    return this.ratingConfigService.create(createRatingConfigInput);
  }

  @Query(() => [RatingConfig], { name: 'ratingConfig' })
  findAll() {
    return this.ratingConfigService.findAll();
  }

  @Query(() => RatingConfig, { name: 'ratingConfig' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.ratingConfigService.findOne(id);
  }

  @Mutation(() => RatingConfig)
  updateRatingConfig(
    @Args('updateRatingConfigInput')
    updateRatingConfigInput: UpdateRatingConfigInput,
  ) {
    return this.ratingConfigService.update(
      updateRatingConfigInput.id,
      updateRatingConfigInput,
    );
  }

  @Mutation(() => RatingConfig)
  removeRatingConfig(@Args('id', { type: () => Int }) id: number) {
    return this.ratingConfigService.remove(id);
  }
}
