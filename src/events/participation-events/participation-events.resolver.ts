import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ParticipationEventsService } from './participation-events.service';
import { ParticipationEvent } from './entities/participation-event.entity';
import { CreateParticipationEventInput } from './dto/create-participation-event.input';
import { UpdateParticipationEventInput } from './dto/update-participation-event.input';
/**
 * @ignore
 */
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

  @Query(() => [ParticipationEvent], { name: 'participationByEvent' })
  findByEvent(@Args('event', { type: () => String }) event: string) {
    return this.participationEventsService.findByEvent(event);
  }

  @Query(() => ParticipationEvent, {
    name: 'participationEvent',
    nullable: true,
  })
  findByEventAndParticipant(
    @Args('event', { type: () => String }) event: string,
    @Args('participant', { type: () => String }) participant: string,
  ) {
    return this.participationEventsService.findByEventAndParticipant(
      event,
      participant,
    );
  }

  @Mutation(() => ParticipationEvent)
  updateParticipantEvent(
    @Args('updateParticipationEventInput')
    updateParticipationEventInput: UpdateParticipationEventInput,
  ) {
    return this.participationEventsService.update(
      updateParticipationEventInput._id,
      updateParticipationEventInput,
    );
  }
}
