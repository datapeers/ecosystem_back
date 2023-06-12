import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ExpertService } from './expert.service';
import { Expert } from './entities/expert.entity';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { LinkExpertsToPhaseArgs } from './args/link-phase-expert.args';

@UseGuards(GqlAuthGuard)
@Resolver(() => Expert)
export class ExpertResolver {
  constructor(private readonly expertService: ExpertService) {}

  @Query(() => [Expert], { name: 'experts' })
  findAll() {
    return this.expertService.findAll();
  }

  @Query(() => Expert, { name: 'expert' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.expertService.findOne(id);
  }

  @Query(() => [Expert], { name: 'expertsPhase' })
  findByPhase(@Args('phase', { type: () => String }) phase: string) {
    return this.expertService.findByPhase(phase);
  }

  @Mutation(() => UpdateResultPayload)
  linkPhaseToExperts(@Args() linkExpertsToPhaseArgs: LinkExpertsToPhaseArgs) {
    return this.expertService.linkWithPhase(linkExpertsToPhaseArgs);
  }

  @Mutation(() => UpdateResultPayload)
  deleteExperts(@Args('ids', { type: () => [String] }) ids: [string]) {
    return this.expertService.delete(ids);
  }
}
