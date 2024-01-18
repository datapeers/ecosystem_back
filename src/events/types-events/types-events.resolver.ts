import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TypesEventsService } from './types-events.service';
import { TypesEvent } from './entities/types-event.entity';
import { CreateTypesEventInput } from './dto/create-types-event.input';
import { UpdateTypesEventInput } from './dto/update-types-event.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
/**
 * @ignore
 */
@UseGuards(GqlAuthGuard)
@Resolver(() => TypesEvent)
export class TypesEventsResolver {
  constructor(private readonly typesEventsService: TypesEventsService) {}

  @Mutation(() => TypesEvent)
  createTypesEvent(
    @Args('createTypesEventInput') createTypesEventInput: CreateTypesEventInput,
  ) {
    return this.typesEventsService.create(createTypesEventInput);
  }

  @Query(() => [TypesEvent], { name: 'typesEvents' })
  findAll() {
    return this.typesEventsService.findAll();
  }

  @Query(() => TypesEvent, { name: 'typeEvent' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.typesEventsService.findOne(id);
  }

  @Mutation(() => TypesEvent)
  updateTypesEvent(
    @Args('updateTypesEventInput') updateTypesEventInput: UpdateTypesEventInput,
  ) {
    return this.typesEventsService.update(
      updateTypesEventInput._id,
      updateTypesEventInput,
    );
  }

  @Mutation(() => TypesEvent)
  removeTypesEvent(@Args('id', { type: () => String }) id: string) {
    return this.typesEventsService.remove(id);
  }
}
