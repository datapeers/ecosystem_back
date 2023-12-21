import { Module, forwardRef } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from './entities/notification.entity';
import { NotificationListenerService } from './listener/notification-listener.service';
import { TypesNotificationsModule } from './types-notifications/types-notifications.module';
import { ConfigNotificationsModule } from './config-notifications/config-notifications.module';
import { EntrepreneurModule } from 'src/entrepreneur/entrepreneur.module';
import { ExpertModule } from 'src/expert/expert.module';

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
    TypesNotificationsModule,
    ConfigNotificationsModule,
  ],
  exports: [NotificationListenerService, NotificationsService],
})
export class NotificationsModule {}
