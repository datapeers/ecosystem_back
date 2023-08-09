import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ExpertService } from './expert.service';
import { Expert } from './entities/expert.entity';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { LinkExpertsToPhaseArgs } from './args/link-phase-expert.args';
import { LinkStartupsExpertsArgs } from './args/link-phase-startups-expert.args';
import { PaginatedResult } from 'src/shared/models/paginated-result';
import { PageRequest } from 'src/shared/models/page-request';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from 'src/auth/types/auth-user';
import { DownloadRequestArgs } from 'src/shared/models/download-request.args';
import { DownloadResult } from 'src/shared/models/download-result';
import { UpdateExpertInput } from './args/update-expert.input';

@UseGuards(GqlAuthGuard)
@Resolver(() => Expert)
export class ExpertResolver {
  constructor(private readonly expertService: ExpertService) {}

  @Query(() => DownloadResult, { name: 'expertsDownload' })
  downloadByRequest(
    @Args() downloadRequest: DownloadRequestArgs,
    @CurrentUser() user: AuthUser,
  ) {
    return this.expertService.downloadByRequest(downloadRequest, user);
  }

  @Query(() => [Expert], { name: 'experts' })
  findAll() {
    return this.expertService.findAll();
  }

  @Query(() => PaginatedResult<Expert>, { name: 'expertsPage' })
  findManyPage(
    @Args('request') request: PageRequest,
    @CurrentUser() user: AuthUser,
  ) {
    return this.expertService.findManyPage(request, user);
  }

  @Query(() => Expert, { name: 'expert' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.expertService.findOne(id);
  }

  @Query(() => [Expert], { name: 'expertsStartup' })
  findByPhase(@Args('startup', { type: () => String }) startup: string) {
    return this.expertService.findByStartup(startup);
  }

  @Query(() => [Expert], { name: 'expertsPhase' })
  findByStartup(@Args('phase', { type: () => String }) phase: string) {
    return this.expertService.findByPhase(phase);
  }

  @Query(() => Expert, { name: 'expertsAccount', nullable: true })
  findByAccount(@Args('accountId', { type: () => String }) accountId: string) {
    return this.expertService.findByAccount(accountId);
  }

  @Mutation(() => UpdateResultPayload)
  linkPhaseToExperts(@Args() linkExpertsToPhaseArgs: LinkExpertsToPhaseArgs) {
    return this.expertService.linkWithPhase(linkExpertsToPhaseArgs);
  }

  @Mutation(() => Expert)
  linkStartupsToExperts(
    @Args() linkStartupsExpertsArgs: LinkStartupsExpertsArgs,
  ) {
    return this.expertService.linkStartupsToExperts(linkStartupsExpertsArgs);
  }

  @Mutation(() => UpdateResultPayload)
  deleteExperts(@Args('ids', { type: () => [String] }) ids: [string]) {
    return this.expertService.delete(ids);
  }

  @ResolveField('isProspect', () => Boolean)
  resolveIsProspect(@Parent() expert: Omit<Expert, 'isProspect'>) {
    return !!expert.phases.length;
  }

  @Mutation(() => Expert)
  updateExpert(
    @Args('updateExpertInput') updateExpertInput: UpdateExpertInput,
  ) {
    return this.expertService.update(updateExpertInput._id, updateExpertInput);
  }
}
