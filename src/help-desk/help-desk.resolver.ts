import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HelpDeskService } from './help-desk.service';
import { HelpDesk } from './entities/help-desk.entity';
import { CreateHelpDeskInput } from './dto/create-help-desk.input';
import { UpdateHelpDeskInput } from './dto/update-help-desk.input';

@Resolver(() => HelpDesk)
export class HelpDeskResolver {
  constructor(private readonly helpDeskService: HelpDeskService) {}

  @Mutation(() => HelpDesk)
  createHelpDesk(@Args('createHelpDeskInput') createHelpDeskInput: CreateHelpDeskInput) {
    return this.helpDeskService.create(createHelpDeskInput);
  }

  @Query(() => [HelpDesk], { name: 'helpDesk' })
  findAll() {
    return this.helpDeskService.findAll();
  }

  @Query(() => HelpDesk, { name: 'helpDesk' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.helpDeskService.findOne(id);
  }

  @Mutation(() => HelpDesk)
  updateHelpDesk(@Args('updateHelpDeskInput') updateHelpDeskInput: UpdateHelpDeskInput) {
    return this.helpDeskService.update(updateHelpDeskInput.id, updateHelpDeskInput);
  }

  @Mutation(() => HelpDesk)
  removeHelpDesk(@Args('id', { type: () => Int }) id: number) {
    return this.helpDeskService.remove(id);
  }
}
