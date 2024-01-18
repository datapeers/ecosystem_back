import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BusinessService } from './business.service';
import { Business } from './entities/business.entity';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { PageRequest } from 'src/shared/models/page-request';
import { PaginatedResult } from 'src/shared/models/paginated-result';
import { LinkWithTargetsArgs } from 'src/shared/args/link-with-targets.args';
import { LinkWithTargetsByRequestArgs } from 'src/shared/args/link-with-targets-by-request.args';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from 'src/auth/types/auth-user';
import { DownloadRequestArgs } from 'src/shared/models/download-request.args';
import { DownloadResult } from 'src/shared/models/download-result';
/**
 * @ignore
 */
@UseGuards(GqlAuthGuard)
@Resolver(() => Business)
export class BusinessResolver {
  constructor(private readonly businessService: BusinessService) {}

  @Query(() => DownloadResult, { name: 'businessesDownload' })
  downloadByRequest(
    @Args() downloadRequest: DownloadRequestArgs,
    @CurrentUser() user: AuthUser,
  ) {
    return this.businessService.downloadByRequest(downloadRequest, user);
  }

  @Query(() => [Business], { name: 'businesses' })
  findAll() {
    return this.businessService.findAll();
  }

  @Query(() => PaginatedResult<Business>, { name: 'businessesPage' })
  findManyPage(
    @Args('request') request: PageRequest,
    @CurrentUser() user: AuthUser,
  ) {
    return this.businessService.findManyPage(request, user);
  }

  @Query(() => Business, { name: 'business' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.businessService.findOne(id);
  }

  @Mutation(() => UpdateResultPayload)
  deleteBusinesses(@Args('ids', { type: () => [String] }) ids: [string]) {
    return this.businessService.delete(ids);
  }

  @Mutation(() => UpdateResultPayload, {
    name: 'linkBusinessesWithEntrepreneursByRequest',
  })
  linkBusinessesWithEntrepreneursByRequest(
    @Args() linkWithTargetsByRequestArgs: LinkWithTargetsByRequestArgs,
  ): Promise<UpdateResultPayload> {
    return this.businessService.linkWithEntrepreneursByRequest(
      linkWithTargetsByRequestArgs,
    );
  }

  @Mutation(() => UpdateResultPayload, {
    name: 'linkBusinessesWithEntrepreneurs',
  })
  linkBusinessesWithEntrepreneurs(
    @Args() { ids, targetIds }: LinkWithTargetsArgs,
  ): Promise<UpdateResultPayload> {
    return this.businessService.linkBusinessesAndEntrepreneurs(ids, targetIds);
  }
}
