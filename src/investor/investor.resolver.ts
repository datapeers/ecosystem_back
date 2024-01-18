import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { InvestorService } from './investor.service';
import { Investor } from './entities/investor.entity';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { PageRequest } from 'src/shared/models/page-request';
import { PaginatedResult } from 'src/shared/models/paginated-result';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from 'src/auth/types/auth-user';
import { DownloadRequestArgs } from 'src/shared/models/download-request.args';
import { DownloadResult } from 'src/shared/models/download-result';
/**
 * @ignore
 */
@UseGuards(GqlAuthGuard)
@Resolver(() => Investor)
export class InvestorResolver {
  constructor(private readonly investorService: InvestorService) {}

  @Query(() => DownloadResult, { name: 'investorsDownload' })
  downloadByRequest(
    @Args() downloadRequest: DownloadRequestArgs,
    @CurrentUser() user: AuthUser,
  ) {
    return this.investorService.downloadByRequest(downloadRequest, user);
  }

  @Query(() => [Investor], { name: 'investors' })
  findAll() {
    return this.investorService.findAll();
  }

  @Query(() => PaginatedResult<Investor>, { name: 'investorsPage' })
  findManyPage(
    @Args('request') request: PageRequest,
    @CurrentUser() user: AuthUser,
  ) {
    return this.investorService.findManyPage(request, user);
  }

  @Query(() => Investor, { name: 'investor' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.investorService.findOne(id);
  }

  @Mutation(() => UpdateResultPayload)
  deleteInvestors(@Args('ids', { type: () => [String] }) ids: [string]) {
    return this.investorService.delete(ids);
  }
}
