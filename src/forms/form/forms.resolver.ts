import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { FormsService } from './forms.service';
import { Form } from './entities/form.entity';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormInput } from './dto/update-form.input';
import { FormTag } from '../form-tag/entities/form-tag.entity';
import { FormTagService } from '../form-tag/form-tag.service';

@Resolver(() => Form)
export class FormsResolver {
  constructor(
    private readonly formsService: FormsService,
    private readonly formTagService: FormTagService
  ) {}

  @Query(() => [Form], { name: 'forms' })
  findAll() {
    return this.formsService.findAll();
  }

  @Query(() => Form, { name: 'form' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.formsService.findOne(id);
  }
  
  @Mutation(() => Form)
  createForm(@Args('createFormInput') createFormInput: CreateFormInput) {
    return this.formsService.create(createFormInput);
  }
  
  @Mutation(() => Form)
  cloneForm(@Args('id', { type: () => String }) id: string) {
    return this.formsService.clone(id);
  }

  @Mutation(() => Form)
  updateForm(@Args('updateFormInput') updateFormInput: UpdateFormInput) {
    return this.formsService.update(updateFormInput._id, updateFormInput);
  }

  @Mutation(() => Form)
  removeForm(@Args('id', { type: () => String }) id: string) {
    return this.formsService.delete(id);
  }

  @ResolveField('tags', () => [FormTag])
  async getFormTags (@Parent() form: Form) {
    const { tags } = form;
    return await this.formTagService.findMany(tags);
  }
}
