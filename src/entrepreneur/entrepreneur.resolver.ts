import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { EntrepreneurService } from './entrepreneur.service';
import { Entrepreneur } from './entities/entrepreneur.entity';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { PageRequest } from 'src/shared/models/page-request';
import { PaginatedResult } from 'src/shared/models/paginated-result';
import { LinkWithTargetsByRequestArgs } from 'src/shared/args/link-with-targets-by-request.args';
import { LinkWithTargetsArgs } from 'src/shared/args/link-with-targets.args';

@UseGuards(GqlAuthGuard)
@Resolver(() => Entrepreneur)
export class EntrepreneurResolver {
  constructor(
    private readonly entrepreneurService: EntrepreneurService,
  ) {}
  entrepreneurAccount;
  @Query(() => [Entrepreneur], { name: 'entrepreneurs' })
  findAll() {
    return this.entrepreneurService.findAll();
  }

  @Query(() => PaginatedResult<Entrepreneur>, { name: 'entrepreneursPage' })
  findManyPage(
    @Args('request') request: PageRequest,
  ) {
    return this.entrepreneurService.findManyPage(request);
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
  deleteEntrepreneurs(@Args('ids', { type: () => [String] }) ids: [string]): Promise<UpdateResultPayload> {
    return this.entrepreneurService.delete(ids);
  }

  @Mutation(() => UpdateResultPayload, { name: 'linkEntrepreneursWithBusinessesByRequest' })
  linkEntrepreneursWithBusinessesByRequest(@Args() linkWithTargetsByRequestArgs: LinkWithTargetsByRequestArgs ): Promise<UpdateResultPayload> {
    return this.entrepreneurService.linkWithBusinessesByRequest(linkWithTargetsByRequestArgs);
  }

  @Mutation(() => UpdateResultPayload, { name: 'linkEntrepreneursWithBusinesses' })
  linkEntrepreneursWithBusinesses(@Args() { ids, targetIds }: LinkWithTargetsArgs ): Promise<UpdateResultPayload> {
    return this.entrepreneurService.linkEntrepreneursAndBusinesses(ids, targetIds);
  }

  @Mutation(() => UpdateResultPayload, { name: 'linkEntrepreneursWithStartupsByRequest' })
  linkEntrepreneursWithStartupsByRequest(@Args() linkWithTargetsByRequestArgs: LinkWithTargetsByRequestArgs ): Promise<UpdateResultPayload> {
    return this.entrepreneurService.linkWithStartupsByRequest(linkWithTargetsByRequestArgs);
  }

  @Mutation(() => UpdateResultPayload, { name: 'linkEntrepreneursWithStartups' })
  linkEntrepreneursWithStartups(@Args() { ids, targetIds }: LinkWithTargetsArgs ): Promise<UpdateResultPayload> {
    return this.entrepreneurService.linkEntrepreneursAndStartups(ids, targetIds);
  }
}
