import {
  Injectable,
  NotFoundException,
  MethodNotAllowedException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateFormSubscriptionInput } from './dto/create-form-subscription.input';
import { InjectModel } from '@nestjs/mongoose';
import { FormSubscription } from './entities/form-subscription.entity';
import { Model } from 'mongoose';
import { PubSub } from 'graphql-subscriptions';
import { SubmitFormSubscriptionArgs } from './args/submit-form-subscription.args';
import { FormCollections } from '../form/enums/form-collections';
import { FormsService } from '../form/forms.service';
import {
  FORM_DOCUMENT_SERVICE_PROVIDER,
  FormDocumentServiceProvider,
} from '../factories/form-document-service-provider';
import { CloseFormSubscriptionArgs } from './args/close-form-subscription.args';
import { SubmitFileInput } from './inputs/submit-file.input';
import { FormSubmissionFiles } from '../form/entities/form-submission-files';
import { pubSubInstance } from 'src/shared/sockets/socket-instance';
/**
 * @ignore
 */
const pubSub = pubSubInstance;

@Injectable()
export class FormSubscriptionService {
  private static readonly triggerName: string = 'formSubscription';

  constructor(
    @InjectModel(FormSubscription.name)
    private readonly formSubscriptionModel: Model<FormSubscription>,
    private readonly formsService: FormsService,
    @Inject(FORM_DOCUMENT_SERVICE_PROVIDER)
    private readonly documentServiceProvider: FormDocumentServiceProvider,
  ) {}

  /**
   * find form subscription
   */
  async findOne(id: string) {
    const subscription = await this.formSubscriptionModel.findById(id).lean();
    if (!subscription)
      throw new NotFoundException(`No subscription found with id ${id}`);
    return subscription;
  }

  /**
   * create form subscription
   */
  async create(createFormSubscriptionInput: CreateFormSubscriptionInput) {
    const subscriptionForm = await this.formsService.findOne(
      createFormSubscriptionInput.form,
    );
    const data = {
      ...createFormSubscriptionInput,
      target: subscriptionForm.target,
    };
    const createdFormSubscription =
      await this.formSubscriptionModel.create(data);
    pubSub.publish(FormSubscriptionService.triggerName, {
      listenFormSubscription: createdFormSubscription,
    });
    return createdFormSubscription;
  }

  /**
   * subscribe channel pubsub
   */
  subscribe() {
    return pubSub.asyncIterator<FormSubscription>([
      FormSubscriptionService.triggerName,
    ]);
  }

  /**
   * submit document in subscription
   */
  async submit({ id, data }: SubmitFormSubscriptionArgs) {
    const subscription = await this.findOne(id);
    if (subscription.opened === false)
      throw new MethodNotAllowedException(
        `Subscription ${id} is already closed`,
      );
    // Get the subscription context data
    const context = subscription.data;
    // If the doc id exists then we have to update it
    const document = await this.handleDocumentSubmit(
      subscription,
      data,
      context,
    );
    const closedSubscription = await this.formSubscriptionModel
      .findByIdAndUpdate(
        id,
        { opened: false, doc: document._id },
        { new: true },
      )
      .lean();
    pubSub.publish(FormSubscriptionService.triggerName, {
      listenFormSubscription: closedSubscription,
    });
    return closedSubscription;
  }

  /**
   * close subscription opened
   */
  async close({
    id,
    doc,
  }: CloseFormSubscriptionArgs): Promise<FormSubscription> {
    const subscription = await this.findOne(id);
    if (subscription.opened === false)
      throw new MethodNotAllowedException(
        `Subscription ${id} is already closed`,
      );
    const closedSubscription = await this.formSubscriptionModel
      .findByIdAndUpdate(id, { opened: false, doc }, { new: true })
      .lean();
    pubSub.publish(FormSubscriptionService.triggerName, {
      listenFormSubscription: closedSubscription,
    });
    return closedSubscription;
  }

  /**
   * handle document sended by subscription
   */
  private async handleDocumentSubmit(
    { target, doc }: FormSubscription,
    data: any,
    context: any,
  ) {
    const documentService = this.documentServiceProvider(target);
    let document;
    if (doc) {
      document = await documentService.updateDocument(doc, data, context);
    } else {
      document = await documentService.createDocument(data, context);
    }
    return document;
  }

  /**
   * get document specified in property inside subscription
   */
  async getSubmittedDocument(
    id: string,
    target: FormCollections,
  ): Promise<any> {
    const documentService = this.documentServiceProvider(target);
    const document = await documentService.getDocument(id);
    return document.item;
  }

  /**
   * submit file in subscription
   */
  async submitFile({ doc, fileKey, fileUrl, form }: SubmitFileInput) {
    const targetForm = await this.formsService.findOne(form);
    const documentService = this.documentServiceProvider(targetForm.target);
    const document = { key: fileKey, url: fileUrl };
    if (!documentService.uploadFile) {
      throw new InternalServerErrorException(
        "Can't upload files to the current form submission.",
      );
    }
    const docFiles = await documentService.uploadFile(doc, document);
    return { documents: docFiles };
  }

  /**
   * get submited file
   */
  async getSubmittedFiles(
    id: string,
    target: FormCollections,
  ): Promise<FormSubmissionFiles> {
    const documentService = this.documentServiceProvider(target);
    const document = await documentService.getDocument(id);
    return { documents: document?.documents };
  }
}
