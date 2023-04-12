import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PhasesService } from './phases.service';
import { Phase } from './entities/phase.entity';
import { CreatePhaseInput } from './dto/create-phase.input';
import { UpdatePhaseInput } from './dto/update-phase.input';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { UseGuards, MethodNotAllowedException } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from '../auth/types/auth-user';
@UseGuards(GqlAuthGuard)
@Resolver(() => Phase)
export class PhasesResolver {
  constructor(private readonly phasesService: PhasesService) {}

  @Mutation(() => Phase)
  createPhase(
    @Args('createPhaseInput') createPhaseInput: CreatePhaseInput,
    @CurrentUser() user: AuthUser,
  ) {
    console.log('entra?');
    const PhaseInput = {
      ...createPhaseInput,
      createBy: user,
    };
    return this.phasesService.create(PhaseInput);
  }

  @Query(() => [Phase], { name: 'phases' })
  findAll() {
    return this.phasesService.findAll();
  }

  @Query(() => Phase, { name: 'phase' })
  findOne(@Args('id', { type: () => String }) id: string) {
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
