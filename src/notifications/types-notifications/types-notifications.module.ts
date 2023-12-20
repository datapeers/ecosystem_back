import { Module } from '@nestjs/common';
import { TypesNotificationsService } from './types-notifications.service';
import { TypesNotificationsResolver } from './types-notifications.resolver';
import { TypesNotification, TypesNotificationSchema } from './entities/types-notification.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TypesNotification.name, schema: TypesNotificationSchema },
    ]),
  ],
  providers: [TypesNotificationsResolver, TypesNotificationsService],
})
export class TypesNotificationsModule {}
