import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { EntrepreneurService } from './entrepreneur.service';
import { Entrepreneur } from './entities/entrepreneur.entity';
import { UpdateResultPayload } from 'src/shared/models/update-result';

@UseGuards(GqlAuthGuard)
@Resolver(() => Entrepreneur)
export class EntrepreneurResolver {
  constructor(private readonly entrepreneurService: EntrepreneurService) {}
  entrepreneurAccount;
  @Query(() => [Entrepreneur], { name: 'entrepreneurs' })
  findAll() {
    return this.entrepreneurService.findAll();
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
  deleteEntrepreneurs(@Args('ids', { type: () => [String] }) ids: [string]) {
    return this.entrepreneurService.delete(ids);
  }
}
