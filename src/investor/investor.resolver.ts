import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { InvestorService } from './investor.service';
import { Investor } from './entities/investor.entity';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { UpdateResultPayload } from 'src/shared/models/update-result';

@UseGuards(GqlAuthGuard)
@Resolver(() => Investor)
export class InvestorResolver {
  constructor(private readonly investorService: InvestorService) {}

  @Query(() => [Investor], { name: 'investors' })
  findAll() {
    return this.investorService.findAll();
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
