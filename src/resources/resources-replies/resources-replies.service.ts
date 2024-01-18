import { CreateResourcesReplyInput } from './dto/create-resources-reply.input';
import { UpdateResourcesReplyInput } from './dto/update-resources-reply.input';
import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResourcesReply } from './entities/resources-reply.entity';
import { Model, Types } from 'mongoose';
import { AuthUser } from 'src/auth/types/auth-user';
import { ResourcesService } from '../resources.service';
import { StartupService } from 'src/startup/startup.service';
import { Startup } from 'src/startup/entities/startup.entity';
import { Resource } from '../entities/resource.entity';
import { Content } from 'src/content/entities/content.entity';
import { ContentService } from 'src/content/content.service';
import { ResourceType } from '../enums/resources-types';
import { ResourceReplyState } from './models/resorce-reply-states';
import { NotificationStates } from 'src/notifications/enum/notification-states.enum';
import { NotificationTypes } from 'src/notifications/enum/notification-types.enum';
import { ContactArgs } from 'src/startup/args/contact-startup.args';
import { EmailsService } from 'src/emails/emails.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsersService } from 'src/users/users.service';
import { EntrepreneurService } from 'src/entrepreneur/entrepreneur.service';
import { default_notification_types } from 'src/notifications/types-notifications/model/types-notification.default';
import { EmailNotificationTypes } from 'src/notifications/types-notifications/model/email-notification-types.enum';
import { ConfigNotificationsService } from 'src/notifications/config-notifications/config-notifications.service';

@Injectable()
export class ResourcesRepliesService {
  constructor(
    @InjectModel(ResourcesReply.name)
    private readonly resourceReplyModel: Model<ResourcesReply>,
    @Inject(forwardRef(() => ResourcesService))
    private readonly resourceService: ResourcesService,
    @Inject(forwardRef(() => StartupService))
    private readonly startupService: StartupService,
    @Inject(forwardRef(() => EntrepreneurService))
    private readonly entrepreneurService: EntrepreneurService,
    @Inject(forwardRef(() => ContentService))
    private readonly contentService: ContentService,
    @Inject(forwardRef(() => EmailsService))
    private readonly emailsService: EmailsService,
    @Inject(forwardRef(() => ConfigNotificationsService))
    private readonly configNotificationsService: ConfigNotificationsService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  /**
   * find resource reply, is only intended to be used by websocket.
   */
  async getDocument(id: string) {
    const document = await this.findOne(id);
    return document;
  }
  /**
   * create resource reply, is only intended to be used by websocket.
   */
  async createDocument(submission: any, context?: any) {
    const data = {
      ...context,
      item: submission,
    };
    const createdDocument = await this.create(data);
    return createdDocument;
  }
  /**
   * update resource reply, is only intended to be used by websocket.
   */
  async updateDocument(id: string, submission: any, context: any) {
    const updatedDocument = await this.update(id, {
      item: submission,
      modified: true,
    });
    return updatedDocument;
  }
  /**
   * create resource reply
   */
  async create(
    createResourcesReplyInput: CreateResourcesReplyInput,
  ): Promise<ResourcesReply> {
    const createdEvaluation = await this.resourceReplyModel.create(
      createResourcesReplyInput,
    );
    return this.findOne(createdEvaluation._id);
  }
  /**
   * find all resource reply
   */
  findAll() {
    return this.resourceReplyModel
      .find({ isDeleted: false })
      .populate('startup')
      .populate('resource')
      .lean();
  }
  /**
   * find resource reply by id
   */
  async findOne(id: string): Promise<ResourcesReply> {
    const resourceReply = await this.resourceReplyModel
      .findById(id)
      .populate('startup')
      .populate('resource')
      .lean();
    if (!resourceReply)
      throw new NotFoundException(`Couldn't find resource reply with id ${id}`);
    return resourceReply;
  }

  /**
   * update resource reply
   */
  async update(
    id: string,
    data: Partial<ResourcesReply>,
  ): Promise<ResourcesReply> {
    await this.resourceReplyModel
      .updateOne({ _id: id }, data, { new: true })
      .lean();
    const updatedDoc = await this.findOne(id);

    return updatedDoc;
  }

  /**
   * find resource reply with inner populate of resources and startup
   */
  async updateDoc(
    id: string,
    updateResourcesReplyInput: UpdateResourcesReplyInput,
  ) {
    delete updateResourcesReplyInput['_id'];
    const updatedReply = await this.resourceReplyModel
      .findOneAndUpdate(
        { _id: id },
        { ...updateResourcesReplyInput },
        { new: true },
      )
      .populate('startup')
      .populate('resource')
      .lean();
    if (updatedReply?.state === ResourceReplyState.Aprobado) {
      this.notificationResource(updatedReply);
    }
    return updatedReply;
  }

  /**
   * soft delete resource reply
   */
  async remove(id: string) {
    const updatedReply = await this.resourceReplyModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .populate('startup')
      .populate('resource')
      .lean();
    return updatedReply;
  }

  /**
   * find all resource reply by resource
   */
  async findByResource(resourceID: string, sprintID: string, user: AuthUser) {
    const resource = await this.resourceService.findOne(resourceID);
    const sprint = await this.contentService.findById(sprintID);
    const replies = await this.resourceReplyModel
      .find({
        resource: resource._id.toString(),
      })
      .lean();
    // console.log(replies);
    let ansList: ResourcesReply[] = [];
    const startupList = await this.startupService.findByPhase(
      resource.phase.toString(),
      user,
    );
    for (const startup of startupList) {
      let reply = replies.find(
        (i) => i.startup.toString() === startup._id.toString(),
      );
      if (!reply) reply = this.createSimpleReply(startup, resource, sprint);
      ansList.push({
        ...reply,
        resource: resource as any,
        startup: startup as any,
        sprint: sprint as any,
      });
    }
    return ansList;
  }

  /**
   * fake resource reply instance
   */
  createSimpleReply(startup: Startup, resource: Resource, sprint: Content) {
    const newReply = new ResourcesReply();
    newReply._id = new Types.ObjectId().toString();
    newReply.item = {} as any;
    newReply.type = resource.type;
    newReply.observations = '';
    newReply.startup = startup as any;
    newReply.sprint = sprint as any;
    newReply.createdAt = new Date();
    newReply.updatedAt = new Date();
    newReply.isDeleted = false;
    newReply.modified = false;
    switch (resource.type) {
      case ResourceType.downloadable:
        newReply.state = ResourceReplyState['Sin descargar'];
        break;
      default:
        newReply.state = ResourceReplyState.Pendiente;
        break;
    }
    return newReply;
  }

  /**
   * find all resource reply by startup and batch wit populate resource
   */
  async findByStartup(startupID: string, phaseID: string) {
    return this.resourceReplyModel
      .find({
        startup: new Types.ObjectId(startupID),
        phase: new Types.ObjectId(phaseID),
      })
      .populate('startup')
      .populate('resource')
      .lean();
  }

  /**
   * find all resource reply in a batch an startup
   */
  async findByStartupWithoutPopulate(startupID: string, phaseID: string) {
    return this.resourceReplyModel
      .find({
        startup: new Types.ObjectId(startupID),
        phase: new Types.ObjectId(phaseID),
      })
      .lean();
  }

  /**
   * notification resource reply approved
   */
  async notificationResource(resourceReply: Resource | any) {
    const entrepreneurs = await this.entrepreneurService.findMany(
      resourceReply.startup['entrepreneurs'].map((i) => i._id.toString()),
    );
    const notificationType = default_notification_types.find(
      (t) => t.type == EmailNotificationTypes.qualifiedResource,
    );
    const notificationsConfig =
      await this.configNotificationsService.findByType(
        notificationType._id.toString(),
      );
    const entrepreneursIds = [];
    for (const entrepreneur of entrepreneurs) {
      if (!entrepreneur?.accountId) continue;
      entrepreneursIds.push({
        _id: entrepreneur._id,
        accountId: entrepreneur.accountId,
      });
    }
    const usersFiles = await this.usersService.findManyByUUID(
      entrepreneursIds.map((i) => i.accountId),
    );
    const usersToNotify = [];
    for (const user of usersFiles) {
      if (
        notificationsConfig.excluded.some(
          (userEmail) => userEmail == user.email,
        )
      )
        continue;
      usersToNotify.push(
        this.buildNotification(user._id, resourceReply.resource),
      );
      await this.sendNotification({
        body: resourceReply.resource['name'],
        from: '',
        subject: `${user.fullName}, ${resourceReply.resource['name']} se aprobó`,
        to: user.email,
        startupID: '',
        startupName: '',
      });
    }
    return this.notificationsService.createMany(usersToNotify);
  }

  /**
   * fake instance resource reply
   */
  buildNotification(accountId: string, resource: Resource | any) {
    let text = `${resource.name} ha sido aprobado`;
    const urlInvitation = process.env.APP_URI + '/home/toolkit';
    return {
      text,
      date: new Date(),
      target: `userNotification ${accountId};`,
      state: NotificationStates.pending,
      type: NotificationTypes.calendar,
      isDeleted: false,
      url: urlInvitation,
    };
  }

  /**
   * send notification email
   */
  async sendNotification(contactArgs: ContactArgs) {
    try {
      const defaultVerifiedEmail = process.env.SEND_GRID_DEFAULT_VERIFIED_EMAIL;
      const urlInvitation = process.env.APP_URI + '/home/toolkit';
      await this.emailsService.send({
        from: defaultVerifiedEmail,
        html: `
          <p>
            <span style="font-size:14px">
              <a href="${urlInvitation}">${urlInvitation}</a>&nbsp;<em><strong>se aprobó ${contactArgs.body} en EcosystemBT, entra y mira los resultados</strong></em>
            </span>
          </p>
          <p><span style="font-size:11px"><em>Recuerda que este mensaje es un intermediario, y solo se envió por ecosystem, y no debes responder en este hilo.</em></span></p>
        `,
        subject: contactArgs.subject,
        text: `${contactArgs.body} ha sido aprobado`,
        to: contactArgs.to,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
