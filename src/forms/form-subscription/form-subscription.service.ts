import { Injectable, NotFoundException, MethodNotAllowedException, NotImplementedException } from '@nestjs/common';
import { CreateFormSubscriptionInput } from './dto/create-form-subscription.input';
import { InjectModel } from '@nestjs/mongoose';
import { FormSubscription } from './entities/form-subscription.entity';
import { Model } from 'mongoose';
import { PubSub } from 'graphql-subscriptions';
import { SubmitFormSubscriptionArgs } from './args/submit-form-subscription.args';
import { FormCollections } from '../form/enums/form-collections';
import { FormsService } from '../form/forms.service';

const pubSub = new PubSub();

@Injectable()
export class FormSubscriptionService {
  private static readonly triggerName: string = "formSubscription";

  constructor(
    @InjectModel(FormSubscription.name) private readonly formSubscriptionModel: Model<FormSubscription>,
    private readonly formsService: FormsService,
  ) {
    
  }

  async findOne(id: string) {
    const subscription = await this.formSubscriptionModel.findById(id).lean();
    if(!subscription) throw new NotFoundException(`No subscription found with id ${id}`);
    return subscription;
  }

  async create(createFormSubscriptionInput: CreateFormSubscriptionInput) {
    const subscriptionForm = await this.formsService.findOne(createFormSubscriptionInput.form);
    createFormSubscriptionInput.target = subscriptionForm.target;
    const createdFormSubscription = await this.formSubscriptionModel.create(createFormSubscriptionInput);
    pubSub.publish(FormSubscriptionService.triggerName, createdFormSubscription);
    return createdFormSubscription;
  }

  subscribe() {
    return pubSub.asyncIterator<FormSubscription>(FormSubscriptionService.triggerName);
  }

  async submit({ id, data }: SubmitFormSubscriptionArgs) {
    const subscription = await this.findOne(id);
    if(subscription.opened === false) throw new MethodNotAllowedException(`Subscription ${id} is already closed`);
    // If the doc id exists then we have to update it
    let doc = subscription.doc;
    await this.handleDocumentSubmit(subscription, data);
    const closedSubscription = await this.formSubscriptionModel.findByIdAndUpdate(id,
      { opened: false, doc },
      { new: true }
    ).lean();
    pubSub.publish(FormSubscriptionService.triggerName, closedSubscription);
    return closedSubscription;
  }

  async close(id: string) {
    const subscription = await this.findOne(id);
    if(subscription.opened === false) throw new MethodNotAllowedException(`Subscription ${id} is already closed`);
    const closedSubscription = await this.formSubscriptionModel.findByIdAndUpdate(id,
      { opened: false },
      { new: true }
    ).lean();
    pubSub.publish(FormSubscriptionService.triggerName, closedSubscription);
    return closedSubscription;
  }

  private async handleDocumentSubmit(subscription: FormSubscription, data: any) {
    switch(subscription.target) {
      case FormCollections.Entrepreneurs:
        throw new NotImplementedException();
      case FormCollections.Resources:
        throw new NotImplementedException();
      case FormCollections.Announcements:
        throw new NotImplementedException();
      case FormCollections.Survey:
        throw new NotImplementedException();
      default:
        throw new NotImplementedException(`There is no implementation to submit the form subscription ${subscription._id}`);
    }
  }
}
