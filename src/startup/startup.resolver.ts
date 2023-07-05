import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { StartupService } from './startup.service';
import { Startup } from './entities/startup.entity';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { LinkStartupToPhaseArgs } from './args/link-phase-startup.args';
import { LinkWithTargetsByRequestArgs } from 'src/shared/args/link-with-targets-by-request.args';
import { LinkWithTargetsArgs } from 'src/shared/args/link-with-targets.args';
import { PageRequest } from 'src/shared/models/page-request';
import { PaginatedResult } from 'src/shared/models/paginated-result';

@UseGuards(GqlAuthGuard)
@Resolver(() => Startup)
export class StartupResolver {
  constructor(private readonly startupService: StartupService) {}

  @Query(() => [Startup], { name: 'startups' })
  findAll() {
    return this.startupService.findAll();
  }

  @Query(() => PaginatedResult<Startup>, { name: 'startupsPage' })
  findManyPage(
    @Args('request') request: PageRequest,
  ) {
    return this.startupService.findManyPage(request);
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

  @Mutation(() => UpdateResultPayload, { name: 'linkStartupsWithEntrepreneursByRequest' })
  linkStartupsWithEntrepreneursByRequest(@Args() linkWithTargetsByRequestArgs: LinkWithTargetsByRequestArgs ): Promise<UpdateResultPayload> {
    return this.startupService.linkWithEntrepreneursByRequest(linkWithTargetsByRequestArgs);
  }

  @Mutation(() => UpdateResultPayload, { name: 'linkStartupsWithEntrepreneurs' })
  linkStartupsWithEntrepreneurs(@Args() { ids, targetIds }: LinkWithTargetsArgs ): Promise<UpdateResultPayload> {
    return this.startupService.linkStartupsAndEntrepreneurs(ids, targetIds);
  }
}
