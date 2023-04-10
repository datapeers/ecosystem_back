import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PhasesService } from './phases.service';
import { Phase } from './entities/phase.entity';
import { CreatePhaseInput } from './dto/create-phase.input';
import { UpdatePhaseInput } from './dto/update-phase.input';

@Resolver(() => Phase)
export class PhasesResolver {
  constructor(private readonly phasesService: PhasesService) {}

  @Mutation(() => Phase)
  createPhase(@Args('createPhaseInput') createPhaseInput: CreatePhaseInput) {
    return this.phasesService.create(createPhaseInput);
  }

  @Query(() => [Phase], { name: 'phases' })
  findAll() {
    return this.phasesService.findAll();
  }

  @Query(() => Phase, { name: 'phase' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.phasesService.findOne(id);
  }

  @Mutation(() => Phase)
  updatePhase(@Args('updatePhaseInput') updatePhaseInput: UpdatePhaseInput) {
    return this.phasesService.update(updatePhaseInput.id, updatePhaseInput);
  }

  @Mutation(() => Phase)
  removePhase(@Args('id', { type: () => Int }) id: number) {
    return this.phasesService.remove(id);
  }
}
