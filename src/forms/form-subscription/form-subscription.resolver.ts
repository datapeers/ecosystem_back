import {
  Resolver,
  Mutation,
  Args,
  Subscription,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { FormSubscriptionService } from './form-subscription.service';
import { FormSubscription } from './entities/form-subscription.entity';
import { CreateFormSubscriptionInput } from './dto/create-form-subscription.input';
import { SubmitFormSubscriptionArgs } from './args/submit-form-subscription.args';
import { Form } from '../form/entities/form.entity';
import { FormsService } from '../form/forms.service';
import GraphQLJSON from 'graphql-type-json';
import { CloseFormSubscriptionArgs } from './args/close-form-subscription.args';
import { SubmitFileInput } from './inputs/submit-file.input';
import { FormSubmissionFiles } from '../form/entities/form-submission-files';
import { GetSubmittedFilesArgs } from './args/get-submitted-files.args';
import { FormFileSubmission } from '../factories/form-file-submission';
import { FormCollections } from '../form/enums/form-collections';
/**
 * @ignore
 */
@Resolver(() => FormSubscription)
export class FormSubscriptionResolver {
  constructor(
    private readonly formSubscriptionService: FormSubscriptionService,
    private readonly formService: FormsService,
  ) {}

  @Query(() => FormSubscription, { name: 'formSubscription' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.formSubscriptionService.findOne(id);
  }

  @Mutation(() => FormSubscription)
  createFormSubscription(
    @Args('createFormSubscriptionInput')
    createFormSubscriptionInput: CreateFormSubscriptionInput,
  ) {
    return this.formSubscriptionService.create(createFormSubscriptionInput);
  }

  @Mutation(() => FormSubscription)
  submitFormSubscription(
    @Args() submitFormSubscriptionArgs: SubmitFormSubscriptionArgs,
  ) {
    return this.formSubscriptionService.submit(submitFormSubscriptionArgs);
  }

  @Mutation(() => FormSubscription)
  closeFormSubscription(
    @Args() closeFormSubscriptionArgs: CloseFormSubscriptionArgs,
  ) {
    return this.formSubscriptionService.close(closeFormSubscriptionArgs);
  }

  @Subscription(() => FormSubscription, {
    filter(
      payload: { listenFormSubscription: FormSubscription },
      variables: { id: string },
    ) {
      return payload.listenFormSubscription._id.toString() === variables.id;
    },
  })
  listenFormSubscription(@Args('id', { type: () => String }) id: string) {
    return this.formSubscriptionService.subscribe();
  }

  @ResolveField('form', () => Form)
  async getFormTags(@Parent() subscription: FormSubscription) {
    const { form } = subscription;
    return this.formService.findOne(form);
  }

  @ResolveField('submission', () => GraphQLJSON)
  async getSubmittedDocument(@Parent() subscription: FormSubscription) {
    let doc = subscription.doc;
    let target = subscription.target;
    if (!doc || !target) return {};
    if (subscription.data && subscription.data['announcement']) {
      target = FormCollections.announcements;
    }
    return this.formSubscriptionService.getSubmittedDocument(doc, target);
  }

  @ResolveField('documents', () => [FormFileSubmission])
  async resolveSubmittedFiles(@Parent() subscription: FormSubscription) {
    const { doc, target } = subscription;
    if (!doc || !target) return {};
    return this.formSubscriptionService.getSubmittedFiles(doc, target);
  }

  @Query(() => FormSubmissionFiles, { name: 'formSubmissionFiles' })
  async getSubmittedFiles(
    @Args() getSubmittedFilesArgs: GetSubmittedFilesArgs,
  ) {
    const { doc, target } = getSubmittedFilesArgs;
    if (!doc || !target) return [];
    return this.formSubscriptionService.getSubmittedFiles(doc, target);
  }

  @Mutation(() => FormSubmissionFiles)
  submitFile(@Args('submitFileInput') submitFileInput: SubmitFileInput) {
    return this.formSubscriptionService.submitFile(submitFileInput);
  }
}
