import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PhasesService } from './phases.service';
import { Phase } from './entities/phase.entity';
import { CreatePhaseInput } from './dto/create-phase.input';
import { UpdatePhaseInput } from './dto/update-phase.input';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from '../auth/types/auth-user';
// @UseGuards(GqlAuthGuard)
@Resolver(() => Phase)
export class PhasesResolver {
  constructor(private readonly phasesService: PhasesService) {}

  @Query(() => [Phase], { name: 'phases' })
  findAll() {
    return this.phasesService.findAll();
  }

  @Query(() => Phase, { name: 'phase' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.phasesService.findOne(id);
  }

  @Mutation(() => Phase)
  createPhase(
    @Args('createPhaseInput') createPhaseInput: CreatePhaseInput,
    @CurrentUser() user: AuthUser,
  ) {
    const PhaseInput = {
      ...createPhaseInput,
      createBy: 'something',
    };
    return this.phasesService.create(PhaseInput, user);
  }

  @Mutation(() => Phase)
  updatePhase(@Args('updatePhaseInput') updatePhaseInput: UpdatePhaseInput) {
    return this.phasesService.update(updatePhaseInput._id, updatePhaseInput);
  }

  @Mutation(() => Phase)
  removePhase(@Args('id', { type: () => String }) id: string) {
    return this.phasesService.remove(id);
  }
}
