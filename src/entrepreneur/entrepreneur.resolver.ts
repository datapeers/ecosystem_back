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
import { EntrepreneurService } from './entrepreneur.service';
import { Entrepreneur } from './entities/entrepreneur.entity';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { PageRequest } from 'src/shared/models/page-request';
import { PaginatedResult } from 'src/shared/models/paginated-result';
import { LinkWithTargetsByRequestArgs } from 'src/shared/args/link-with-targets-by-request.args';
import { LinkWithTargetsArgs } from 'src/shared/args/link-with-targets.args';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from '../auth/types/auth-user';
import { DownloadRequestArgs } from 'src/shared/models/download-request.args';
import { DownloadResult } from 'src/shared/models/download-result';
/**
 * @ignore
 */
@UseGuards(GqlAuthGuard)
@Resolver(() => Entrepreneur)
export class EntrepreneurResolver {
  constructor(private readonly entrepreneurService: EntrepreneurService) {}

  @Query(() => DownloadResult, { name: 'entrepreneursDownload' })
  downloadByRequest(
    @Args() downloadRequest: DownloadRequestArgs,
    @CurrentUser() user: AuthUser,
  ) {
    return this.entrepreneurService.downloadByRequest(downloadRequest, user);
  }

  @Query(() => [Entrepreneur], { name: 'entrepreneurs' })
  findAll() {
    return this.entrepreneurService.findAll();
  }

  @Query(() => PaginatedResult<Entrepreneur>, { name: 'entrepreneursPage' })
  findManyPage(
    @Args('request') request: PageRequest,
    @CurrentUser() user: AuthUser,
  ) {
    return this.entrepreneurService.findManyPage(request, user);
  }

  @Query(() => Entrepreneur, { name: 'entrepreneur' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.entrepreneurService.findOne(id);
  }

  @Query(() => Entrepreneur, { name: 'entrepreneurAccount', nullable: true })
  findByAccount(@Args('accountId', { type: () => String }) accountId: string) {
    return this.entrepreneurService.findByAccount(accountId);
  }

  @Mutation(() => UpdateResultPayload)
  deleteEntrepreneurs(
    @Args('ids', { type: () => [String] }) ids: [string],
  ): Promise<UpdateResultPayload> {
    return this.entrepreneurService.delete(ids);
  }

  @Mutation(() => UpdateResultPayload, {
    name: 'linkEntrepreneursWithBusinessesByRequest',
  })
  linkEntrepreneursWithBusinessesByRequest(
    @Args() linkWithTargetsByRequestArgs: LinkWithTargetsByRequestArgs,
    @CurrentUser() user: AuthUser,
  ): Promise<UpdateResultPayload> {
    return this.entrepreneurService.linkWithBusinessesByRequest(
      linkWithTargetsByRequestArgs,
      user,
    );
  }

  @Mutation(() => UpdateResultPayload, {
    name: 'linkEntrepreneursWithBusinesses',
  })
  linkEntrepreneursWithBusinesses(
    @Args() { ids, targetIds }: LinkWithTargetsArgs,
  ): Promise<UpdateResultPayload> {
    return this.entrepreneurService.linkEntrepreneursAndBusinesses(
      ids,
      targetIds,
    );
  }

  @Mutation(() => UpdateResultPayload, {
    name: 'linkEntrepreneursWithStartupsByRequest',
  })
  linkEntrepreneursWithStartupsByRequest(
    @Args() linkWithTargetsByRequestArgs: LinkWithTargetsByRequestArgs,
    @CurrentUser() user: AuthUser,
  ): Promise<UpdateResultPayload> {
    return this.entrepreneurService.linkWithStartupsByRequest(
      linkWithTargetsByRequestArgs,
      user,
    );
  }

  @Mutation(() => UpdateResultPayload, {
    name: 'linkEntrepreneursWithStartups',
  })
  linkEntrepreneursWithStartups(
    @Args() { ids, targetIds }: LinkWithTargetsArgs,
  ): Promise<UpdateResultPayload> {
    return this.entrepreneurService.linkEntrepreneursAndStartups(
      ids,
      targetIds,
    );
  }

  @ResolveField('isProspect', () => Boolean)
  resolveIsProspect(@Parent() entrepreneur: Omit<Entrepreneur, 'isProspect'>) {
    return entrepreneur.startups.some((startup) => !!startup.phases?.length);
  }
}
