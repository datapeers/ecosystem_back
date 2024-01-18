import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { HelpDeskService } from './help-desk.service';
import { HelpDeskTicket } from './entities/help-desk.entity';
import { CreateHelpDeskInput } from './dto/create-help-desk.input';
import { UpdateHelpDeskInput } from './dto/update-help-desk.input';
import { HelpDeskFilterInput } from './dto/help-desk-filter.input';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from '../auth/types/auth-user';
import GraphQLJSON from 'graphql-type-json';
/**
 * @ignore
 */
@UseGuards(GqlAuthGuard)
@Resolver(() => HelpDeskTicket)
export class HelpDeskResolver {
  constructor(private readonly helpDeskService: HelpDeskService) {}

  @Mutation(() => HelpDeskTicket)
  createHelpDesk(
    @Args('createHelpDeskInput') createHelpDeskInput: CreateHelpDeskInput,
  ) {
    return this.helpDeskService.create(createHelpDeskInput);
  }

  @Query(() => [HelpDeskTicket], { name: 'helpDeskFilterUI' })
  findAll(
    @Args('filter', { type: () => HelpDeskFilterInput })
    filter: HelpDeskFilterInput,
  ) {
    return this.helpDeskService.findAll(filter);
  }

  @Query(() => [HelpDeskTicket], { name: 'helpDeskFiltered' })
  findByFilters(
    @Args('filters', { type: () => GraphQLJSON }) filters: any,
    @CurrentUser() user: AuthUser,
  ) {
    return this.helpDeskService.findByFilters(user, filters);
  }

  @Query(() => HelpDeskTicket, { name: 'helpDesk' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.helpDeskService.findOne(id);
  }

  @Mutation(() => HelpDeskTicket)
  updateHelpDesk(
    @Args('updateHelpDeskInput') updateHelpDeskInput: UpdateHelpDeskInput,
  ) {
    return this.helpDeskService.update(
      updateHelpDeskInput._id,
      updateHelpDeskInput,
    );
  }

  @Mutation(() => HelpDeskTicket)
  removeHelpDesk(@Args('id', { type: () => ID }) id: string) {
    return this.helpDeskService.remove(id);
  }
}
