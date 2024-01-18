import { CreateEvaluationInput } from './dto/create-evaluation.input';
import { InjectModel } from '@nestjs/mongoose';
import { Evaluation } from './entities/evaluation.entity';
import { Model, Types } from 'mongoose';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { AuthUser } from 'src/auth/types/auth-user';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigEvaluationsService } from './config-evaluations/config-evaluations.service';
import { ExpertService } from 'src/expert/expert.service';
import { StartupService } from 'src/startup/startup.service';
import { UsersService } from 'src/users/users.service';
import { Cron } from '@nestjs/schedule';
import { default_notification_types } from 'src/notifications/types-notifications/model/types-notification.default';
import { EmailNotificationTypes } from 'src/notifications/types-notifications/model/email-notification-types.enum';
import { ConfigNotificationsService } from 'src/notifications/config-notifications/config-notifications.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ConfigEvaluation } from './config-evaluations/entities/config-evaluation.entity';
import { NotificationStates } from 'src/notifications/enum/notification-states.enum';
import { NotificationTypes } from 'src/notifications/enum/notification-types.enum';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class EvaluationsService {
  canBeEvaluated = [ValidRoles.user, ValidRoles.teamCoach, ValidRoles.expert];
  canBeReviewer = [
    ValidRoles.user,
    ValidRoles.host,
    ValidRoles.teamCoach,
    ValidRoles.expert,
  ];
  constructor(
    @InjectModel(Evaluation.name)
    private readonly evaluationModel: Model<Evaluation>,
    @Inject(forwardRef(() => ConfigEvaluationsService))
    private readonly configService: ConfigEvaluationsService,
    @Inject(forwardRef(() => StartupService))
    private readonly startupService: StartupService,
    @Inject(forwardRef(() => ExpertService))
    private readonly expertService: ExpertService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => ConfigNotificationsService))
    private readonly configNotificationsService: ConfigNotificationsService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * find doc evaluations, is only intended to be used by websocket.
   */
  async getDocument(id: string) {
    const document = await this.findOne(id);
    return document;
  }

  /**
   * create doc evaluations, is only intended to be used by websocket.
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
   * update doc evaluations, is only intended to be used by websocket.
   */
  async updateDocument(id: string, submission: any, context: any) {
    const updatedDocument = await this.update(id, { item: submission });
    return updatedDocument;
  }

  /**
   * find all doc evaluations
   */
  findAll() {
    return this.evaluationModel.find();
  }

  /**
   * find doc evaluations by config
   */
  async findByConfig(config: string, user: AuthUser) {
    const configEvaluation = await this.configService.findOne(config);
    const evaluations = await this.evaluationModel
      .find({
        config,
        isDeleted: false,
      })
      .lean();
    if (!this.canBeEvaluated.includes(configEvaluation.evaluated as ValidRoles))
      throw new BadRequestException('Invalid evaluated', {
        cause: new Error(),
        description: 'Evaluated its not a valid type for this endpoint',
      });
    if (!this.canBeReviewer.includes(configEvaluation.reviewer as ValidRoles))
      throw new BadRequestException('Invalid reviewer', {
        cause: new Error(),
        description: 'Reviewer its not a valid type for this endpoint',
      });
    let ansList: Evaluation[] = [];
    switch (configEvaluation.evaluated) {
      case ValidRoles.user:
        const startupList = await this.startupService.findByPhase(
          configEvaluation.phase,
          user,
        );
        for (const startup of startupList) {
          let evaluation = evaluations.find(
            (i) =>
              i.evaluated === startup._id.toString() &&
              i.config === configEvaluation._id.toString(),
          );
          if (!evaluation)
            evaluation = this.createSimpleEvaluation(
              startup._id.toString(),
              configEvaluation._id.toString(),
              'pendiente',
              configEvaluation.form,
            );
          ansList.push(evaluation);
        }
        break;
      case ValidRoles.teamCoach:
        const teamCoachList = await this.usersService.findMany({
          roles: [ValidRoles.teamCoach],
          relationsAssign: { batches: configEvaluation.phase },
        });
        for (const teamCoach of teamCoachList) {
          let evaluation = evaluations.find(
            (i) =>
              i.evaluated === teamCoach._id.toString() &&
              i.config === configEvaluation._id.toString(),
          );
          if (!evaluation)
            evaluation = this.createSimpleEvaluation(
              teamCoach._id.toString(),
              configEvaluation._id.toString(),
              'pendiente',
              configEvaluation.form,
            );
          ansList.push(evaluation);
        }
        break;
      case ValidRoles.expert:
        const expertList = await this.expertService.findByPhase(
          configEvaluation.phase,
        );
        for (const expert of expertList) {
          let evaluation = evaluations.find(
            (i) =>
              i.evaluated === expert._id.toString() &&
              i.config === configEvaluation._id.toString(),
          );
          if (!evaluation)
            evaluation = this.createSimpleEvaluation(
              expert._id.toString(),
              configEvaluation._id.toString(),
              'pendiente',
              configEvaluation.form,
            );
          ansList.push(evaluation);
        }
        break;
      default:
        break;
    }
    return ansList;
  }

  /**
   * find doc evaluations by id
   */
  async findOne(id: string): Promise<Evaluation> {
    const evaluation = await this.evaluationModel.findById(id);
    if (!evaluation)
      throw new NotFoundException(`Couldn't find evaluation with id ${id}`);
    return evaluation;
  }

  /**
   * find doc evaluations by reviewer
   */
  async findOneByReviewer(
    reviewer: string,
    config: string,
    evaluated: string,
  ): Promise<Evaluation> {
    const evaluation = await this.evaluationModel.findOne({
      reviewer,
      config,
      evaluated,
    });
    return evaluation;
  }

  /**
   * create evaluated doc
   */
  async create(data: CreateEvaluationInput): Promise<Evaluation> {
    const createdEvaluation = await this.evaluationModel.create(data);
    return createdEvaluation;
  }

  /**
   * update evaluated doc
   */
  async update(id: string, data: Partial<Evaluation>): Promise<Evaluation> {
    await this.evaluationModel
      .updateOne({ _id: id }, data, { new: true })
      .lean();
    return this.findOne(id);
  }

  /**
   * soft delete evaluated doc list
   */
  async delete(ids: string[]): Promise<UpdateResultPayload> {
    const updateResult = await this.evaluationModel.updateMany(
      { _id: { $in: ids.map((id) => new Types.ObjectId(id)) } },
      { isDeleted: true },
    );
    return {
      ...updateResult,
      upsertedId: updateResult.upsertedId?.toString(),
    };
  }

  /**
   * create a fake evaluated doc
   */
  createSimpleEvaluation(
    evaluated: string,
    config: string,
    state: string,
    form: string,
  ): Evaluation {
    const newEvaluation = new Evaluation();
    newEvaluation._id = new Types.ObjectId().toString();
    newEvaluation.item = {} as any;
    newEvaluation.evaluated = evaluated;
    newEvaluation.reviewer = '';
    newEvaluation.form = form;
    newEvaluation.config = config;
    newEvaluation.state = state;
    newEvaluation.createdAt = new Date();
    newEvaluation.updatedAt = new Date();
    newEvaluation.isDeleted = false;
    return newEvaluation;
  }

  /**
   * get name of evaluated person
   */
  async getName(evaluation: Evaluation) {
    const configEvaluation = await this.configService.findOne(
      evaluation.config,
    );
    switch (configEvaluation.evaluated) {
      case ValidRoles.user:
        const startup = await this.startupService.findOne(evaluation.evaluated);
        return startup.item['nombre'];
      case ValidRoles.teamCoach:
        const teamCoach = await this.usersService.findById(
          evaluation.evaluated,
        );
        return teamCoach.fullName;
      case ValidRoles.expert:
        const expert = await this.expertService.findOne(evaluation.evaluated);
        return expert.item['nombre'];
      default:
        return '';
    }
  }

  /**
   * CRON JOB to find the evaluations that have to be done today and send the respective notifications and release the content to the users.
   */
  @Cron('0 0 6 * * *', { name: 'cronEvaluations' })
  async checkEvaluationsLiberation() {
    let evaluationsConfigs = await this.configService.findToday(
      ValidRoles.user,
    );
    if (!evaluationsConfigs.length) return;
    for (const configEvaluation of evaluationsConfigs) {
      const startupList = await this.startupService.findByPhase(
        configEvaluation.phase,
      );
      const listIdsEntrepreneurs = [];
      for (const startup of startupList) {
        for (const entrepreneur of startup.entrepreneurs) {
          if (entrepreneur.rol !== 'leader') continue;
          listIdsEntrepreneurs.push(entrepreneur._id.toString());
        }
      }
      const entrepreneurs =
        await this.startupService.getEntrepreneurs(listIdsEntrepreneurs);
      const uidList = [];

      for (const iterator of entrepreneurs) {
        if (!iterator.accountId || iterator.accountId === '') continue;
        uidList.push(iterator.accountId);
      }
      const users = await this.usersService.findManyByUUID(uidList);
      const notificationType = default_notification_types.find(
        (t) => t.type == EmailNotificationTypes.assessmentAvailable,
      );

      const notificationsConfig =
        await this.configNotificationsService.findByType(
          notificationType._id.toString(),
        );
      const notifications = [];
      for (const user of users) {
        if (
          notificationsConfig.excluded.some(
            (userEmail) => userEmail == user.email,
          )
        )
          continue;
        notifications.push(this.buildNotification(user, configEvaluation));
      }
      this.notificationsService.createMany(notifications);
    }
  }

  /**
   * instance a notification for evaluation by user
   */
  buildNotification(user: User, config: ConfigEvaluation) {
    let evaluated = '';
    switch (config.evaluated) {
      case ValidRoles.expert:
        evaluated = 'experts';
        break;
      case ValidRoles.teamCoach:
        evaluated = 'team coach`s';
      default:
        break;
    }
    let text = `${user.fullName}, califica a tus ${evaluated}`;
    return {
      text,
      date: new Date(),
      target: `userNotification ${user._id};`,
      state: NotificationStates.pending,
      type: NotificationTypes.rate,
      isDeleted: false,
      url: config._id,
    };
  }
}
