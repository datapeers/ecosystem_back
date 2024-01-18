import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ActaService } from './acta.service';
import { Acta } from './entities/acta.entity';
import { CreateActaInput } from './dto/create-acta.input';
import { UpdateActaInput } from './dto/update-acta.input';
/**
 * @ignore
 */
@Resolver(() => Acta)
export class ActaResolver {
  constructor(private readonly actaService: ActaService) {}

  @Mutation(() => Acta)
  createActa(@Args('createActaInput') createActaInput: CreateActaInput) {
    return this.actaService.create(createActaInput);
  }

  @Query(() => [Acta], { name: 'acta' })
  findAll() {
    return this.actaService.findAll();
  }

  @Query(() => Acta, { name: 'acta' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.actaService.findOne(id);
  }

  @Query(() => Acta, { name: 'actaEvent', nullable: true })
  findByEvent(@Args('event', { type: () => String }) event: string) {
    return this.actaService.findByEvent(event);
  }

  @Query(() => [Acta], { name: 'actaEventsList' })
  findByEventsList(@Args('events', { type: () => [String] }) events: string[]) {
    return this.actaService.findByEventsList(events);
  }

  @Mutation(() => Acta)
  updateActa(@Args('updateActaInput') updateActaInput: UpdateActaInput) {
    return this.actaService.update(updateActaInput._id, updateActaInput);
  }

  @Mutation(() => Acta)
  removeActa(@Args('id', { type: () => String }) id: string) {
    return this.actaService.remove(id);
  }
}
