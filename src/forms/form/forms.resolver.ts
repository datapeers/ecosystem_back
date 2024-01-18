import {
  Resolver,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Query,
} from '@nestjs/graphql';
import { FormsService } from './forms.service';
import { Form } from './entities/form.entity';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormInput } from './dto/update-form.input';
import { FormTag } from '../form-tag/entities/form-tag.entity';
import { FormTagService } from '../form-tag/form-tag.service';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { FindFormsArgs } from './args/find-forms.args';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from 'src/auth/types/auth-user';
/**
 * @ignore
 */
@Resolver(() => Form)
export class FormsResolver {
  constructor(
    private readonly formsService: FormsService,
    private readonly formTagService: FormTagService,
  ) {}

  @Query(() => [Form], { name: 'forms' })
  findMany(@Args() findFormsArgs: FindFormsArgs) {
    return this.formsService.findMany(findFormsArgs);
  }

  @Query(() => Form, { name: 'form' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.formsService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Form)
  createForm(
    @Args('createFormInput') createFormInput: CreateFormInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.formsService.create(createFormInput, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Form)
  cloneForm(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.formsService.clone(id, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Form)
  updateForm(
    @Args('updateFormInput') updateFormInput: UpdateFormInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.formsService.update(updateFormInput._id, updateFormInput, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Form)
  deleteForm(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.formsService.delete(id, user);
  }

  @ResolveField('tags', () => [FormTag])
  async getFormTags(@Parent() form: Form) {
    const { tags } = form;
    return await this.formTagService.findMany(tags);
  }
}
