import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { FormTagService } from './form-tag.service';
import { FormTag } from './entities/form-tag.entity';
import { CreateFormTagInput } from './dto/create-form-tag.input';
import { UpdateFormTagInput } from '../form-tag/dto/update-form-tag.input';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
/**
 * @ignore
 */
@Resolver(() => FormTag)
export class FormTagResolver {
  constructor(
    private readonly formTagService: FormTagService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [FormTag], { name: 'formTags' })
  findAll() {
    return this.formTagService.findAll();
  }

  @Query(() => FormTag, { name: 'formTag' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.formTagService.findOne(id);
  }

  @Mutation(() => FormTag)
  createFormTag(
    @Args('createFormTagInput') createFormTagInput: CreateFormTagInput,
  ) {
    return this.formTagService.create(createFormTagInput);
  }

  @Mutation(() => FormTag)
  updateFormTag(
    @Args('updateFormTagInput') updateFormTagInput: UpdateFormTagInput,
  ) {
    return this.formTagService.update(
      updateFormTagInput._id,
      updateFormTagInput,
    );
  }

  @Mutation(() => FormTag)
  removeFormTag(@Args('id', { type: () => Int }) id: string) {
    return this.formTagService.delete(id);
  }

  @ResolveField('updatedBy', () => User)
  async getInvitationCreator(@Parent() formTag: FormTag) {
    const { updatedBy } = formTag;
    return await this.usersService.findOne(updatedBy);
  }
}
