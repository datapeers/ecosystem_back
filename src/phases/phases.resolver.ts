import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PhasesService } from './phases.service';
import { Phase } from './entities/phase.entity';
import { CreatePhaseInput } from './dto/create-phase.input';
import { UpdatePhaseInput } from './dto/update-phase.input';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from '../auth/types/auth-user';
import { Stage } from 'src/stages/entities/stage.entity';
import { SearchBatchInput } from './dto/others.inpt';
import { SearchInBatchOutput } from 'src/shared/models/search-result.model';
/**
 * @ignore
 */
@UseGuards(GqlAuthGuard)
@Resolver(() => Phase)
export class PhasesResolver {
  constructor(private readonly phasesService: PhasesService) {}

  @Query(() => [Phase], { name: 'phases' })
  findAll(@CurrentUser() user: AuthUser) {
    return this.phasesService.findAll(user);
  }

  @Query(() => [Phase], { name: 'phasesList' })
  findByList(@Args('ids', { type: () => [String] }) ids: string[]) {
    return this.phasesService.findList(ids);
  }

  @Query(() => [Phase], { name: 'phasesBases' })
  findBases() {
    return this.phasesService.findPhaseBases();
  }

  @Query(() => Phase, { name: 'phase' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.phasesService.findOne(id);
  }

  @Query(() => SearchInBatchOutput, { name: 'searchInBatch' })
  searchInBatch(
    @Args('OthersInput') OthersInput: SearchBatchInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.phasesService.search(
      user,
      OthersInput.batchIds,
      OthersInput.searchValue,
    );
  }

  @Mutation(() => Phase)
  createPhase(
    @Args('createPhaseInput') createPhaseInput: CreatePhaseInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.phasesService.create(createPhaseInput, user);
  }

  @Mutation(() => Phase)
  updatePhase(@Args('updatePhaseInput') updatePhaseInput: UpdatePhaseInput) {
    return this.phasesService.update(updatePhaseInput._id, updatePhaseInput);
  }

  @Mutation(() => Phase)
  removePhase(@Args('id', { type: () => String }) id: string) {
    return this.phasesService.remove(id);
  }

  @ResolveField('calcEndDate', () => Date)
  resolveEndDatePhase(@Parent() phase: Omit<Phase, 'calcEndDate'>) {
    return this.phasesService.calcEndDate(phase);
  }

  @ResolveField('stageDoc', () => Stage)
  resolveStage(@Parent() phase: Omit<Phase, 'stageDoc'>) {
    return this.phasesService.getStage(phase);
  }

  @ResolveField('participants', () => Number)
  resolveNumbParticipants(@Parent() phase: Omit<Phase, 'participants'>) {
    return this.phasesService.numbParticipants(phase._id.toString());
  }
}
