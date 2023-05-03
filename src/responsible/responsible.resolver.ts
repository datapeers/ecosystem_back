import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ResponsibleService } from './responsible.service';
import { Responsible } from './entities/responsible.entity';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { UpdateResultPayload } from 'src/shared/models/update-result';

@UseGuards(GqlAuthGuard)
@Resolver(() => Responsible)
export class ResponsibleResolver {
  constructor(private readonly responsibleService: ResponsibleService) {}

  @Query(() => [Responsible], { name: 'responsibles' })
  findAll() {
    return this.responsibleService.findAll();
  }

  @Query(() => Responsible, { name: 'responsible' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.responsibleService.findOne(id);
  }

  @Mutation(() => UpdateResultPayload)
  deleteResponsibles(@Args('ids', { type: () => [String] }) ids: [string]) {
    return this.responsibleService.delete(ids);
  }
}
