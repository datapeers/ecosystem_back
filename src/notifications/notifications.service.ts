import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './entities/notification.entity';
import { Model } from 'mongoose';
import { pubSubInstance } from 'src/shared/sockets/socket-instance';
import { AuthUser } from '../auth/types/auth-user';
import { channelsNotificationEnum } from './enum/chanels-notification.enum';
import { rolValues } from 'src/auth/enums/valid-roles.enum';
import { Notification as NotificationC } from './class/notification';
import { NotificationTypes } from './enum/notification-types.enum';
import { NotificationStates } from './enum/notification-states.enum';
const pubSub = pubSubInstance;
@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  _logger = new Logger(NotificationsService.name);

  subscribe(
    user: AuthUser,
    others?:
      | { entrepreneurId?: string; startupId?: string; expertId?: string }
      | Record<string, any>,
  ) {
    const listTriggerNotifications = [
      `${channelsNotificationEnum.userNotification} ${user._id}`,
    ];
    if (others?.entrepreneurId)
      listTriggerNotifications.push(
        `${channelsNotificationEnum.entrepreneurNotification} ${others?.entrepreneurId}`,
      );
    if (others?.startupId)
      listTriggerNotifications.push(
        `${channelsNotificationEnum.startupNotification} ${others?.startupId}`,
      );
    if (others?.expertId)
      listTriggerNotifications.push(
        `${channelsNotificationEnum.expertNotification} ${others?.expertId}`,
      );
    return pubSub.asyncIterator<any>(listTriggerNotifications);
  }

  async onModuleInit() {
    let notifications = await this.notificationModel.find({});
    if (notifications.length === 0) {
      const notificationsList = [
        new NotificationC({
          text: 'Jhon Doe, tu tutor ha aprobado tu entregable',
          type: NotificationTypes.notes,
          state: NotificationStates.pending,
          isDeleted: false,
          date: '2023-08-09T10:45:00.000Z' as any,
          target: `${channelsNotificationEnum.userNotification} 6487ba2c91f11804c123ae2b;`,
        }),
        new NotificationC({
          text: 'Te restan dos días para completar a tiempo la entrega de la Fase 3',
          type: NotificationTypes.homework,
          state: NotificationStates.pending,
          isDeleted: false,
          date: '2023-08-09T10:45:00.000Z' as any,
          target: `${channelsNotificationEnum.userNotification} 6487ba2c91f11804c123ae2b;`,
        }),
        new NotificationC({
          text: '¡Felicidades! Has completado la Fase 2. No pierdas el ritmo',
          type: NotificationTypes.approved,
          state: NotificationStates.pending,
          isDeleted: false,
          date: '2023-08-09T10:45:00.000Z' as any,
          target: `${channelsNotificationEnum.userNotification} 6487ba2c91f11804c123ae2b;`,
        }),
        new NotificationC({
          text: 'Tienes el evento programado para hoy: "Fortalecimiento de habilidades y aptitudes"',
          type: NotificationTypes.calendar,
          state: NotificationStates.pending,
          isDeleted: false,
          date: '2023-08-09T10:45:00.000Z' as any,
          target: `${channelsNotificationEnum.userNotification} 6487ba2c91f11804c123ae2b;`,
        }),
        new NotificationC({
          text: 'Jhon Doe, califica a tus tutores y teamCoaches de la fase 2',
          type: NotificationTypes.rate,
          state: NotificationStates.pending,
          isDeleted: false,
          date: '2023-08-09T10:45:00.000Z' as any,
          url: '',
          target: `${channelsNotificationEnum.userNotification} 6487ba2c91f11804c123ae2b;`,
        }),
      ];
      await this.notificationModel.insertMany(notificationsList);
    }
  }

  async create(createNotificationInput: CreateNotificationInput) {
    try {
      var newNotification = await this.notificationModel.create(
        createNotificationInput,
      );
      const targets = newNotification.target.split(';');
      for (const iterator of targets) {
        pubSub.publish(iterator, {
          newNotification: newNotification.toObject(),
        });
      }
      return newNotification;
    } catch (error) {
      this._logger.error(
        `Error saving notification ${createNotificationInput}`,
      );
      throw new InternalServerErrorException(`Error creating notification`);
    }
  }

  async findOne(id: string) {
    try {
      var ans = await this.notificationModel.findOne({ _id: id });
      if (!ans) {
        throw new NotFoundException(`Notification with di ${id} not found`);
      }
      return ans.toObject();
    } catch (error) {
      throw new InternalServerErrorException(`Error creating notification`);
    }
  }

  findByUser(userId: string) {
    return this.notificationModel.find({
      target: { $regex: userId },
      isDeleted: false,
    });
  }

  async findNotificationsByTargets(targets: string[]) {
    const regexConditions = targets.map((target) => ({
      target: { $regex: target },
    }));

    const notifications = await this.notificationModel.find({
      $and: regexConditions,
      isDeleted: false,
    });
    return notifications;
  }

  async update(id: string, updateNotificationInput: UpdateNotificationInput) {
    try {
      await this.findOne(id);

      delete updateNotificationInput['_id'];
      const updatedNotification = await this.notificationModel
        .findOneAndUpdate(
          { _id: id },
          { ...updateNotificationInput },
          { new: true },
        )
        .lean();
      return updatedNotification;
    } catch (error) {
      this._logger.error(
        `Error updating notification ${updateNotificationInput} ${error}`,
      );
    }
  }

  async remove(id: string) {
    const updatedType = await this.notificationModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    return updatedType;
  }
}
