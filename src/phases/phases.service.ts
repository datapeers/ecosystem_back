import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreatePhaseInput } from './dto/create-phase.input';
import { UpdatePhaseInput } from './dto/update-phase.input';
import { Phase } from './entities/phase.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthUser } from 'src/auth/types/auth-user';
import { ContentService } from 'src/content/content.service';
import { ActivitiesConfigService } from 'src/activities-config/activities-config.service';
import { ResourcesService } from '../resources/resources.service';
import * as moment from 'moment';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { ExpertService } from '../expert/expert.service';
import { StartupService } from 'src/startup/startup.service';
import { add, differenceInMilliseconds } from 'date-fns';
import { StagesService } from 'src/stages/stages.service';
import { Stage } from 'src/stages/entities/stage.entity';
import { UserLogService } from 'src/user-log/user-log.service';
import { ResourcesRepliesService } from 'src/resources/resources-replies/resources-replies.service';
import {
  searchResource,
  searchResult,
} from 'src/shared/models/search-result.model';
import { Resource } from 'src/resources/entities/resource.entity';
import { Cron } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import { default_notification_types } from 'src/notifications/types-notifications/model/types-notification.default';
import { EmailNotificationTypes } from 'src/notifications/types-notifications/model/email-notification-types.enum';
import { ConfigNotificationsService } from 'src/notifications/config-notifications/config-notifications.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationStates } from 'src/notifications/enum/notification-states.enum';
import { NotificationTypes } from 'src/notifications/enum/notification-types.enum';

@Injectable()
export class PhasesService {
  constructor(
    @InjectModel(Phase.name) private readonly phaseModel: Model<Phase>,
    private readonly startupService: StartupService,
    private readonly expertService: ExpertService,
    private readonly contentService: ContentService,
    private readonly resourcesService: ResourcesService,
    private readonly activitiesConfigService: ActivitiesConfigService,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => StagesService))
    private readonly stagesService: StagesService,
    @Inject(forwardRef(() => UserLogService))
    private readonly logsService: UserLogService,
    @Inject(forwardRef(() => ResourcesRepliesService))
    private readonly resourceRepliesService: ResourcesRepliesService,
    @Inject(forwardRef(() => ConfigNotificationsService))
    private readonly configNotificationsService: ConfigNotificationsService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * find phases and batches by user
   */
  async findAll(user: AuthUser): Promise<Phase[]> {
    switch (user.rolDoc.type) {
      case ValidRoles.expert:
        return this.getExpertBatchesAndPhases(user);
      case ValidRoles.host:
        return this.getHostBatchesAndPhases(user);
      case ValidRoles.teamCoach:
        return this.getTeamCoachBatchesAndHost(user);
      default:
        return await this.phaseModel.find({ isDeleted: false });
    }
  }

  /**
   * find phases and batches list
   */
  async findList(ids: string[]) {
    const phaseBases = await this.phaseModel
      .find({ isDeleted: false, basePhase: true })
      .lean();
    const batches = await this.phaseModel
      .find({
        isDeleted: false,
        _id: { $in: ids.map((i) => new Types.ObjectId(i)) },
      })
      .lean();
    // console.log(phaseBases);
    return [...phaseBases, ...batches];
  }

  /**
   * find only phases
   */
  async findPhaseBases() {
    const phaseBases = await this.phaseModel
      .find({ isDeleted: false, basePhase: true })
      .lean();
    return phaseBases;
  }

  /**
   * find by list
   */
  async find(ids: string[]): Promise<Phase[]> {
    const phases = await this.phaseModel.find({ isDeleted: false });
    return phases;
  }

  /**
   * find by id
   */
  async findOne(id: string): Promise<Phase> {
    const phase = await this.phaseModel.findOne({ _id: id }).lean();
    if (!phase) throw new NotFoundException(`No phase found with id ${id}`);
    return phase;
  }

  /**
   * find a phase or batch
   */
  async create(
    createPhaseInput: CreatePhaseInput,
    user: AuthUser,
  ): Promise<Phase> {
    if (createPhaseInput.childrenOf) {
      return await this.clone(createPhaseInput, user);
    } else {
      const createdPhase = await this.phaseModel.create({
        ...createPhaseInput,
        createdBy: user.uid,
      });
      return createdPhase;
    }
  }

  /**
   * create batch cloning a phase
   */
  async clone(createPhaseInput: CreatePhaseInput, user: AuthUser) {
    const father = await this.findOne(createPhaseInput.childrenOf);
    delete father['_id'];
    delete father['name'];
    delete father['description'];
    delete father['startAt'];
    delete father['endAt'];
    delete createPhaseInput['stage'];
    delete createPhaseInput['landing'];
    delete createPhaseInput['thumbnail'];
    const createdBatch = await this.phaseModel.create({
      ...father,
      ...createPhaseInput,
      createdBy: user.uid,
    });
    await this.duplicateContent(createPhaseInput.childrenOf, createdBatch);
    await this.activitiesConfigService.duplicate(
      createPhaseInput.childrenOf,
      createdBatch._id.toString(),
    );
    return createdBatch;
  }

  /**
   * clone content
   */
  async duplicateContent(phaseOld: string, phaseNew: Phase) {
    const docs = await this.contentService.findAll(phaseOld);
    const operationsContent = [];
    const operationsResources = [];
    let startDate = moment(phaseNew.startAt);
    for (const iterator of docs) {
      const newSprint = {
        ...iterator,
        _id: new Types.ObjectId(),
        phase: phaseNew._id,
        childs: [],
        resources: [],
      };
      if (newSprint.extra_options?.duration) {
        newSprint.extra_options['start'] = startDate.toDate();
        startDate = startDate.add(newSprint.extra_options?.duration, 'days');
        newSprint.extra_options['end'] = startDate.toDate();
        startDate = startDate.add(1, 'days');
        delete newSprint.extra_options['duration'];
      }
      const resourcesSprint = [];
      for (const resource of iterator.resources) {
        const newResource = {
          ...resource,
          _id: new Types.ObjectId(),
          phase: phaseNew._id,
          content: newSprint._id,
        };
        resourcesSprint.push(newResource._id);
        operationsResources.push(newResource);
      }
      newSprint.resources = resourcesSprint;
      const contentSprint = [];
      for (const content of iterator.childs) {
        const newContent = {
          ...content,
          _id: new Types.ObjectId(),
          phase: phaseNew._id,
          childs: [],
          resources: [],
        };
        const resourcesContent = [];
        for (const resource of content.resources) {
          const newResource = {
            ...resource,
            _id: new Types.ObjectId(),
            phase: phaseNew._id,
            content: newSprint._id,
          };
          resourcesContent.push(newResource._id);
          operationsResources.push(newResource);
        }
        newContent.resources = resourcesContent;
        contentSprint.push(newContent._id);
        operationsContent.push(newContent);
      }
      newSprint.childs = contentSprint;
      operationsContent.push(newSprint);
    }
    await this.contentService.createMany(operationsContent);
    await this.resourcesService.createMany(operationsResources);
    return true;
  }

  /**
   * update a phase or batch
   */
  async update(id: string, updatePhaseInput: UpdatePhaseInput): Promise<Phase> {
    delete updatePhaseInput['_id'];
    const updatedPhase = await this.phaseModel
      .findOneAndUpdate({ _id: id }, { ...updatePhaseInput }, { new: true })
      .lean();
    return updatedPhase;
  }

  /**
   * soft delete a phase or batch
   */
  async remove(id: string) {
    const deletedPhase = await this.phaseModel.findOneAndUpdate(
      { _id: id },
      { isDeleted: true },
      { new: true, lean: true },
    );
    return deletedPhase;
  }

  /**
   * find batches by expert
   */
  async getExpertBatchesAndPhases(user: AuthUser) {
    const docExpert = await this.expertService.findByAccount(user.uid);
    const batchesExpert = await this.phaseModel
      .find({
        _id: { $in: docExpert.phases },
        isDeleted: false,
      })
      .lean();
    const phasesExpert = await this.phaseModel
      .find({
        _id: { $in: batchesExpert.map((i) => i.childrenOf) },
        isDeleted: false,
      })
      .lean();
    return [...phasesExpert, ...batchesExpert];
  }

  /**
   * find batches by host
   */
  async getHostBatchesAndPhases(user: AuthUser) {
    if (!user.relationsAssign || Object.keys(user.relationsAssign).length === 0)
      return [];
    const batchesHost = await this.phaseModel
      .find({
        _id: {
          $in: user.relationsAssign?.batches?.map(
            (i) => new Types.ObjectId(i._id),
          ),
        },
        isDeleted: false,
      })
      .lean();
    const parentsBatches = await this.phaseModel
      .find({
        _id: {
          $in: batchesHost.map((i) => i.childrenOf),
        },
        isDeleted: false,
      })
      .lean();
    const listPhasesIds = user.relationsAssign.phases.map(
      (i) => new Types.ObjectId(i._id),
    );
    const phasesHost = await this.phaseModel
      .find({
        $or: [
          {
            _id: {
              $in: listPhasesIds,
            },
          },
          { childrenOf: { $in: listPhasesIds } },
        ],
        isDeleted: false,
      })
      .lean();

    const ansList = [...batchesHost, ...parentsBatches, ...phasesHost];
    const ids: Set<string> = new Set();
    const ans = [];
    for (const iterator of ansList) {
      if (ids.has(iterator._id.toString())) continue;
      ans.push(iterator);
      ids.add(iterator._id.toString());
    }
    return ans;
  }

  /**
   * find batches by team coach
   */
  async getTeamCoachBatchesAndHost(user: AuthUser) {
    if (!user.relationsAssign || Object.keys(user.relationsAssign).length === 0)
      return [];
    const batches = await this.phaseModel
      .find({
        _id: {
          $in: user.relationsAssign?.batches?.map(
            (i) => new Types.ObjectId(i._id),
          ),
        },
        isDeleted: false,
      })
      .lean();
    const phases = await this.phaseModel
      .find({
        _id: {
          $in: batches.map((i) => new Types.ObjectId(i.childrenOf)),
        },
        isDeleted: false,
      })
      .lean();
    return [...phases, ...batches];
  }

  /**
   * find batches by host
   */
  async getAllBatchesAccessHost(user: AuthUser): Promise<Types.ObjectId[]> {
    if (!user.relationsAssign || Object.keys(user.relationsAssign).length === 0)
      return [];
    const batchesHost = await this.phaseModel
      .find(
        {
          _id: {
            $in: user.relationsAssign?.batches?.map(
              (i) => new Types.ObjectId(i._id),
            ),
          },
          isDeleted: false,
        },
        { _id: 1 },
      )
      .lean();
    const parentsBatches = await this.phaseModel
      .find(
        {
          _id: {
            $in: batchesHost.map((i) => i.childrenOf),
          },
          isDeleted: false,
        },
        { _id: 1 },
      )
      .lean();
    const listPhasesIds = user.relationsAssign.phases.map(
      (i) => new Types.ObjectId(i._id),
    );
    const phasesHost = await this.phaseModel
      .find(
        {
          $or: [
            {
              _id: {
                $in: listPhasesIds,
              },
            },
            { childrenOf: { $in: listPhasesIds } },
          ],
          isDeleted: false,
        },
        { _id: 1 },
      )
      .lean();

    const ansList = [...batchesHost, ...parentsBatches, ...phasesHost];
    const ids: Set<string> = new Set();
    const ans = [];
    for (const iterator of ansList) {
      if (ids.has(iterator._id.toString())) continue;
      ans.push(iterator._id);
      ids.add(iterator._id.toString());
    }
    return ans;
  }

  /**
   * calculate end date of a batch
   */
  async calcEndDate(phase: Phase) {
    if (phase.basePhase) return new Date(phase.endAt);
    const docs = await this.contentService.findAll(phase._id.toString());
    const lastSprint = docs[docs.length - 1];
    if (!lastSprint) return new Date(phase.endAt);
    return moment(lastSprint.extra_options.end).add(1, 'days').toDate();
  }

  /**
   * find stage of a phase or batch
   */
  async getStage(phase: Phase): Promise<Stage> {
    const stage = await this.stagesService.findOne(phase.stage);
    return stage;
  }

  /**
   * search
   */
  async search(user: AuthUser, batchIds: string[], searchValue: string) {
    let phasesList: Phase[] = [];
    if (ValidRoles.user === (user.rolDoc.type as ValidRoles)) {
      phasesList = await this.findList(batchIds);
    } else {
      phasesList = await this.findAll(user);
    }
    phasesList = phasesList.filter((i) => !i.basePhase);
    let ansPhases: searchResult[] = [];
    let ansContent: searchResult[] = [];
    let ansResource: searchResult[] = [];
    for (const phase of phasesList) {
      if (phase.name.match(new RegExp(searchValue, 'i')) !== null)
        ansPhases.push(
          new searchResult({
            label: phase.name,
            type: 'batch',
            metadata: { _id: phase._id, tag: 'Batch' },
          }),
        );
      let sprints = await this.contentService.findAll(
        phase._id.toString(),
        user,
      );
      for (const sprint of sprints) {
        for (const content of sprint.childs) {
          if (content.name.match(new RegExp(searchValue, 'i')) !== null)
            ansContent.push(
              new searchResult({
                label: content.name,
                type: 'content',
                metadata: {
                  _id: content._id,
                  batch: phase._id,
                  tag: 'Contenido',
                },
              }),
            );
          const resourcesContent = searchResource(
            content.resources,
            searchValue,
            phase._id,
            sprint._id,
            content._id,
          );
          ansResource = ansResource.concat(resourcesContent);
        }
        const resourcesContent = searchResource(
          sprint.resources,
          searchValue,
          phase._id,
          sprint._id,
        );
        ansResource = ansResource.concat(resourcesContent);
      }
    }
    return { ansPhases, ansContent, ansResource };
  }

  /**
   * find numb of startups in batch
   */
  async numbParticipants(phase: string) {
    return await this.startupService.findNumbParticipants(phase);
  }

  /**
   * cron job to notify batch ending
   */
  @Cron('0 0 5 * * *', { name: 'cronBatchEnd' })
  async checkPhaseFinal() {
    let phases = await this.phaseModel
      .find({ basePhase: false, isDeleted: false, isActive: true })
      .lean();
    const today = moment(new Date());
    for (const phase of phases) {
      const endDate = await this.calcEndDate(phase);
      const inputDate = moment(new Date(endDate));
      // Compara año, mes y día sin tener en cuenta la hora
      const isToday = inputDate.isSame(today, 'day');
      if (isToday) {
        this.phaseModel.updateOne({ _id: phase._id }, { isActive: false });
        this.sendNotificationAndEmailsPhase(phase);
      }
    }
  }

  /**
   * notification emails sender
   */
  async sendNotificationAndEmailsPhase(phase: Phase) {
    const startupsParticipants = await this.startupService.findByPhase(
      phase._id.toString(),
    );
    const entrepreneursIds = [];
    for (const startup of startupsParticipants) {
      //if (startup.entrepreneurs)
      for (const entrepreneurLink of startup.entrepreneurs) {
        if (entrepreneurLink.state === 'leaved') continue;
        entrepreneursIds.push(entrepreneurLink._id.toString());
      }
    }
    const entrepreneursDocs =
      await this.startupService.getEntrepreneurs(entrepreneursIds);
    const uidList = [];
    for (const entrepreneur of entrepreneursDocs) {
      if (!entrepreneur.accountId || entrepreneur?.accountId === '') continue;
      uidList.push(entrepreneur.accountId);
    }
    const userDocs = await this.usersService.findManyByUUID(uidList);
    const notificationType = default_notification_types.find(
      (t) => t.type == EmailNotificationTypes.phaseCompletion,
    );
    const notificationsConfig =
      await this.configNotificationsService.findByType(
        notificationType._id.toString(),
      );
    const notifications = [];
    for (const iterator of userDocs) {
      if (
        notificationsConfig.excluded.some(
          (userEmail) => userEmail == iterator.email,
        )
      )
        continue;
      notifications.push(this.buildNotificationEnd(iterator._id, phase));
    }
    this.notificationsService.createMany(notifications);
  }

  /**
   * build instance notification for batch
   */
  buildNotificationEnd(accountId: string, batch: Phase) {
    let text = `¡Felicidades! Has completado ${batch.name}. No pierdas el ritmo`;
    // const urlInvitation = process.env.APP_URI + '/home/calendar';
    return {
      text,
      date: new Date(),
      target: `userNotification ${accountId};`,
      state: NotificationStates.pending,
      type: NotificationTypes.approved,
      isDeleted: false,
      url: '',
    };
  }
}
