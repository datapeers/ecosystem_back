import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { Event as EventEntity } from './entities/event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from 'src/auth/types/auth-user';

@UseGuards(GqlAuthGuard)
@Resolver(() => EventEntity)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Mutation(() => EventEntity)
  createEvent(@Args('createEventInput') createEventInput: CreateEventInput) {
    return this.eventsService.create(createEventInput);
  }

  @Query(() => [EventEntity], { name: 'events' })
  findAll(@CurrentUser() user: AuthUser) {
    return this.eventsService.findAll();
  }

  @Query(() => [EventEntity], { name: 'eventsPhase' })
  findByPhase(
    @Args('phase', { type: () => String }) phase: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.eventsService.findByPhase(phase, user);
  }

  @Query(() => [EventEntity], { name: 'eventsUser' })
  findByUser(@CurrentUser() user: AuthUser) {
    return this.eventsService.findByUser(user);
  }

  @Query(() => EventEntity, { name: 'event' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.eventsService.findOne(id);
  }

  @Mutation(() => EventEntity)
  updateEvent(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
    return this.eventsService.update(updateEventInput._id, updateEventInput);
  }

  @Mutation(() => EventEntity)
  removeEvent(@Args('id', { type: () => String }) id: string) {
    return this.eventsService.remove(id);
  }
}
