import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TypesNotification } from './entities/types-notification.entity';
import { default_notification_types } from './model/types-notification.default';

@Injectable()
export class TypesNotificationsService {
  constructor(
    @InjectModel(TypesNotification.name)
    private readonly typesNotificationModel: Model<TypesNotification>,
  ) {}

  async seed() {
    const defaultNotificationTypes = default_notification_types.map(t => ({ ...t, type: undefined }));
    return this.typesNotificationModel.create(defaultNotificationTypes);
  }
}
