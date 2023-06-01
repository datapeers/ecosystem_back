import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BusinessService } from './business.service';
import { Business } from './entities/business.entity';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';

@UseGuards(GqlAuthGuard)
@Resolver(() => Business)
export class BusinessResolver {
  constructor(private readonly businessService: BusinessService) {}

  @Query(() => [Business], { name: 'businesses' })
  findAll() {
    return this.businessService.findAll();
  }

  @Query(() => Business, { name: 'business' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.businessService.findOne(id);
  }

  @Mutation(() => UpdateResultPayload)
  deleteBusinesses(@Args('ids', { type: () => [String] }) ids: [string]) {
    return this.businessService.delete(ids);
  }
}
