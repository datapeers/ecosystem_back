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
import { Entrepreneur } from 'src/entrepreneur/entities/entrepreneur.entity';
import { Expert } from 'src/expert/entities/expert.entity';
import { default_notification_types } from './types-notifications/model/types-notification.default';
import { EmailNotificationTypes } from './types-notifications/model/email-notification-types.enum';
import { ConfigNotificationsService } from './config-notifications/config-notifications.service';
import { ExpertEventSubmit } from 'src/events/dto/create-event.input';
import { Event as EventEntity } from 'src/events/entities/event.entity';
/**
 * @ignore
 */
const pubSub = pubSubInstance;
@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    private readonly configNotificationsService: ConfigNotificationsService,
  ) {}

  _logger = new Logger(NotificationsService.name);

  /**
   * subscription channel in notification
   * @ignore
   */
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

  /**
   * create a notification
   */
  async create(createNotificationInput: CreateNotificationInput) {
    try {
      var newNotification = await this.notificationModel.create(
        createNotificationInput,
      );
      const targets = newNotification.target.split(';');
      // for (const iterator of targets) {
      //   pubSub.publish(iterator, {
      //     newNotification: newNotification.toObject(),
      //   });
      // }
      return newNotification;
    } catch (error) {
      this._logger.error(
        `Error saving notification ${createNotificationInput}`,
      );
      throw new InternalServerErrorException(`Error creating notification`);
    }
  }

  /**
   * find notification by id
   */
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

  /**
   * find notification users
   */
  findByUser(userId: string) {
    return this.notificationModel.find({
      target: { $regex: userId },
      isDeleted: false,
    });
  }

  /**
   * find notification by list
   */
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

  /**
   * update notification
   */
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
  /**
   * soft delete notification
   */
  async remove(id: string) {
    const updatedType = await this.notificationModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    return updatedType;
  }

  /**
   * create many notifications
   */
  async createMany(createNotificationInput: CreateNotificationInput[]) {
    try {
      var newNotification = await this.notificationModel.insertMany(
        createNotificationInput,
      );
      // for (const iterator of targets) {
      //   pubSub.publish(iterator, {
      //     newNotification: newNotification.toObject(),
      //   });
      // }
      return newNotification;
    } catch (error) {
      this._logger.error(
        `Error creating notification ${createNotificationInput}`,
      );
      throw new InternalServerErrorException(`Error creating notification`);
    }
  }
}
