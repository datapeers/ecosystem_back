import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { HelpDeskService } from './help-desk.service';
import { HelpDeskTicket } from './entities/help-desk.entity';
import { CreateHelpDeskInput } from './dto/create-help-desk.input';
import { UpdateHelpDeskInput } from './dto/update-help-desk.input';
import { FilterRuleName } from '@aws-sdk/client-s3';
import { HelpDeskFilterInput } from './dto/help-desk-filter.input';

@Resolver(() => HelpDeskTicket)
export class HelpDeskResolver {
  constructor(private readonly helpDeskService: HelpDeskService) {}

  @Mutation(() => HelpDeskTicket)
  createHelpDesk(
    @Args('createHelpDeskInput') createHelpDeskInput: CreateHelpDeskInput,
  ) {
    return this.helpDeskService.create(createHelpDeskInput);
  }

  @Query(() => [HelpDeskTicket], { name: 'helpDeskTickets' })
  findAll(
    @Args('filter', { type: () => HelpDeskFilterInput })
    filter: HelpDeskFilterInput,
  ) {
    return this.helpDeskService.findAll(filter);
  }

  @Query(() => HelpDeskTicket, { name: 'helpDeskTicket' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.helpDeskService.findOne(id);
  }

  @Mutation(() => HelpDeskTicket)
  updateHelpDesk(
    @Args('updateHelpDeskInput') updateHelpDeskInput: UpdateHelpDeskInput,
  ) {
    return this.helpDeskService.update(
      updateHelpDeskInput.id,
      updateHelpDeskInput,
    );
  }

  @Mutation(() => HelpDeskTicket)
  removeHelpDesk(@Args('id', { type: () => ID }) id: string) {
    return this.helpDeskService.remove(id);
  }
}
