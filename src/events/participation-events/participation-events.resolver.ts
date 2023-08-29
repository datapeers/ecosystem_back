import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ParticipationEventsService } from './participation-events.service';
import { ParticipationEvent } from './entities/participation-event.entity';
import { CreateParticipationEventInput } from './dto/create-participation-event.input';

@Resolver(() => ParticipationEvent)
export class ParticipationEventsResolver {
  constructor(
    private readonly participationEventsService: ParticipationEventsService,
  ) {}

  @Mutation(() => ParticipationEvent)
  createParticipationEvent(
    @Args('createParticipationEventInput')
    createParticipationEventInput: CreateParticipationEventInput,
  ) {
    return this.participationEventsService.create(
      createParticipationEventInput,
    );
  }

  @Query(() => [ParticipationEvent], { name: 'participationEvents' })
  findAll() {
    return this.participationEventsService.findAll();
  }

  @Query(() => ParticipationEvent, { name: 'participationEvent' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.participationEventsService.findOne(id);
  }
}
