import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
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
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from '../auth/types/auth-user';
import { DownloadRequestArgs } from 'src/shared/models/download-request.args';
import { DownloadResult } from 'src/shared/models/download-result';
import { GraphQLJSONObject } from 'graphql-scalars';
import { ContactArgs } from './args/contact-startup.args';
import { EntrepreneurStartupArgs } from 'src/shared/args/entrepreneur-startup-data';
/**
 * @ignore
 */
@UseGuards(GqlAuthGuard)
@Resolver(() => Startup)
export class StartupResolver {
  constructor(private readonly startupService: StartupService) {}

  @Query(() => DownloadResult, { name: 'startupsDownload' })
  downloadByRequest(
    @Args() downloadRequest: DownloadRequestArgs,
    @CurrentUser() user: AuthUser,
  ) {
    return this.startupService.downloadByRequest(downloadRequest, user);
  }

  @Query(() => [Startup], { name: 'startups' })
  findAll() {
    return this.startupService.findAll();
  }

  @Query(() => PaginatedResult<Startup>, { name: 'startupsPage' })
  findManyPage(
    @Args('request') request: PageRequest,
    @CurrentUser() user: AuthUser,
  ) {
    return this.startupService.findManyPage(request, user);
  }

  @Query(() => [Startup], { name: 'startupsCommunities' })
  findLikeCommunity() {
    return this.startupService.findLikeCommunity();
  }

  @Query(() => [Startup], { name: 'startupsPhase' })
  findByPhase(
    @Args('phase', { type: () => String }) phase: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.startupService.findByPhase(phase, user);
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

  @Mutation(() => Startup)
  changeThumbnailStartup(
    @Args('id', { type: () => String }) id: string,
    @Args('thumbnail', { type: () => String }) thumbnail: string,
  ) {
    return this.startupService.update(id, { thumbnail });
  }

  @Mutation(() => UpdateResultPayload, {
    name: 'linkStartupsWithEntrepreneursByRequest',
  })
  linkStartupsWithEntrepreneursByRequest(
    @Args() linkWithTargetsByRequestArgs: LinkWithTargetsByRequestArgs,
    @CurrentUser() user: AuthUser,
  ): Promise<UpdateResultPayload> {
    return this.startupService.linkWithEntrepreneursByRequest(
      linkWithTargetsByRequestArgs,
      user,
    );
  }

  @Mutation(() => UpdateResultPayload, {
    name: 'linkStartupsWithEntrepreneurs',
  })
  linkStartupsWithEntrepreneurs(
    @Args() { ids, targetIds }: LinkWithTargetsArgs,
  ): Promise<UpdateResultPayload> {
    return this.startupService.linkStartupsAndEntrepreneurs(ids, targetIds);
  }

  @ResolveField('isProspect', () => Boolean)
  resolveIsProspect(@Parent() startup: Omit<Startup, 'isProspect'>) {
    return !!startup.phases.length;
  }

  @ResolveField('lastPhase', () => GraphQLJSONObject, { nullable: true })
  resolveLastPhase(@Parent() startup: Omit<Startup, 'lastPhase'>) {
    return startup['lastPhase'];
  }

  @Query(() => Boolean, { name: 'contactCommunity' })
  contactStartup(
    @Args() contactInputs: ContactArgs,
    @CurrentUser() user: AuthUser,
  ) {
    if (!user) return false;
    return this.startupService.contactStartup(contactInputs);
  }

  @Mutation(() => UpdateResultPayload, {
    name: 'updateDataEntrepreneurStartup',
  })
  updateDataEntrepreneurStartup(
    @Args() updateDataEntrepreneur: EntrepreneurStartupArgs,
  ) {
    return this.startupService.updateDataEntrepreneur(updateDataEntrepreneur);
  }
}
