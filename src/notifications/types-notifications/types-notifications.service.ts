import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TypesNotification } from './entities/types-notification.entity';
import { default_notification_types } from './model/types-notification.default';

@Injectable()
export class TypesNotificationsService implements OnModuleInit {
  constructor(
    @InjectModel(TypesNotification.name)
    private readonly typesNotificationModel: Model<TypesNotification>,
  ) {}

  /**
   * initialize types of notifications
   */
  async onModuleInit() {
    let types = await this.typesNotificationModel.find({});
    if (types.length === 0) {
      await this.typesNotificationModel.insertMany(default_notification_types);
    }
  }

  /**
   * get all types of notifications
   */
  async getTypes() {
    return this.typesNotificationModel.find({}).lean();
  }
}
