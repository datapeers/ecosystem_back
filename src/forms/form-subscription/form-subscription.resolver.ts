import { Resolver, Mutation, Args, Subscription, Query, ResolveField, Parent } from '@nestjs/graphql';
import { FormSubscriptionService } from './form-subscription.service';
import { FormSubscription } from './entities/form-subscription.entity';
import { CreateFormSubscriptionInput } from './dto/create-form-subscription.input';
import { SubmitFormSubscriptionArgs } from './args/submit-form-subscription.args';
import { Form } from '../form/entities/form.entity';
import { FormsService } from '../form/forms.service';
import GraphQLJSON from 'graphql-type-json';

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
  createFormSubscription(@Args('createFormSubscriptionInput') createFormSubscriptionInput: CreateFormSubscriptionInput) {
    return this.formSubscriptionService.create(createFormSubscriptionInput);
  }

  @Mutation(() => FormSubscription)
  submitFormSubscription(@Args() submitFormSubscriptionArgs: SubmitFormSubscriptionArgs) {
    return this.formSubscriptionService.submit(submitFormSubscriptionArgs);
  }

  @Mutation(() => FormSubscription)
  closeFormSubscription(@Args('id', { type: () => String }) id: string) {
    return this.formSubscriptionService.close(id);
  }

  @Subscription(() => FormSubscription,
    {
      filter(payload: { listenFormSubscription: FormSubscription }, variables: { id: string } ) {
        return payload.listenFormSubscription._id.toString() === variables.id;
      }
    }
  )
  listenFormSubscription(@Args('id', { type: () => String }) id: string) {
    return this.formSubscriptionService.subscribe();
  }

  @ResolveField('form', () => Form)
  async getFormTags (@Parent() subscription: FormSubscription) {
    const { form } = subscription;
    return this.formService.findOne(form);
  }

  @ResolveField('submission', () => GraphQLJSON)
  async getSubmittedDocument (@Parent() subscription: FormSubscription) {
    const { doc, target } = subscription;
    if(!doc || !target) return {};
    return this.formSubscriptionService.getSubmittedDocument(doc, target);
  }
}