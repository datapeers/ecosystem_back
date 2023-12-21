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
