import { Module } from '@nestjs/common';
import { ConfigNotificationsService } from './config-notifications.service';
import { ConfigNotificationsResolver } from './config-notifications.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigNotification, ConfigNotificationSchema } from './entities/config-notification.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConfigNotification.name, schema: ConfigNotificationSchema },
    ]),
  ],
  providers: [ConfigNotificationsResolver, ConfigNotificationsService],
  exports: [ConfigNotificationsService]
})
export class ConfigNotificationsModule {}
