import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from './entities/notification.entity';
import { NotificationListenerService } from './listener/notification-listener.service';

@Module({
  providers: [
    NotificationsResolver,
    NotificationsService,
    NotificationListenerService,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  exports: [NotificationListenerService, NotificationsService],
})
export class NotificationsModule {}
