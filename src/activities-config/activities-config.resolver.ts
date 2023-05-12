import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ActivitiesConfigService } from './activities-config.service';
import { ActivitiesConfig } from './entities/activities-config.entity';

@Resolver(() => ActivitiesConfig)
export class ActivitiesConfigResolver {
  constructor(
    private readonly activitiesConfigService: ActivitiesConfigService,
  ) {}

  @Mutation(() => ActivitiesConfig)
  createActivitiesConfig(
    @Args('createActivitiesConfigInput') createActivitiesConfigInput: any,
  ) {
    return this.activitiesConfigService.create(createActivitiesConfigInput);
  }

  @Query(() => [ActivitiesConfig], { name: 'activitiesConfig' })
  findAll() {
    return this.activitiesConfigService.findAll();
  }

  @Query(() => ActivitiesConfig, { name: 'activitiesConfig' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.activitiesConfigService.findOne(id);
  }

  @Mutation(() => ActivitiesConfig)
  updateActivitiesConfig(
    @Args('updateActivitiesConfigInput') updateActivitiesConfigInput: any,
  ) {
    return this.activitiesConfigService.update(
      updateActivitiesConfigInput.id,
      updateActivitiesConfigInput,
    );
  }

  @Mutation(() => ActivitiesConfig)
  removeActivitiesConfig(@Args('id', { type: () => Int }) id: number) {
    return this.activitiesConfigService.remove(id);
  }
}
