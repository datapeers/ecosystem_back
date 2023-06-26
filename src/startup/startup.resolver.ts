import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { StartupService } from './startup.service';
import { Startup } from './entities/startup.entity';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { LinkStartupToPhaseArgs } from './args/link-phase-startup.args';

@UseGuards(GqlAuthGuard)
@Resolver(() => Startup)
export class StartupResolver {
  constructor(private readonly startupService: StartupService) {}

  @Query(() => [Startup], { name: 'startups' })
  findAll() {
    return this.startupService.findAll();
  }

  @Query(() => [Startup], { name: 'startupsCommunities' })
  findLikeCommunity() {
    return this.startupService.findLikeCommunity();
  }

  @Query(() => [Startup], { name: 'startupsPhase' })
  findByPhase(@Args('phase', { type: () => String }) phase: string) {
    return this.startupService.findByPhase(phase);
  }

  @Query(() => Startup, { name: 'startup' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.startupService.findOne(id);
  }

  @Mutation(() => UpdateResultPayload)
  linkPhaseToStartup(@Args() linkStartupToPhaseArgs: LinkStartupToPhaseArgs) {
    return this.startupService.linkWithPhase(linkStartupToPhaseArgs);
  }

  @Mutation(() => UpdateResultPayload)
  deleteStartups(@Args('ids', { type: () => [String] }) ids: [string]) {
    return this.startupService.delete(ids);
  }
}
