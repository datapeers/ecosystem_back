import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { StartupService } from './startup.service';
import { Startup } from './entities/startup.entity';
import { UpdateResultPayload } from 'src/shared/models/update-result';

@UseGuards(GqlAuthGuard)
@Resolver(() => Startup)
export class StartupResolver {
  constructor(private readonly startupService: StartupService) {}

  @Query(() => [Startup], { name: 'startups' })
  findAll() {
    return this.startupService.findAll();
  }

  @Query(() => Startup, { name: 'startup' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.startupService.findOne(id);
  }

  @Mutation(() => UpdateResultPayload)
  deleteStartups(@Args('ids', { type: () => [String] }) ids: [string]) {
    return this.startupService.delete(ids);
  }
}
