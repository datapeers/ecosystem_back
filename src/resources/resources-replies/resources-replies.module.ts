import { Module, forwardRef } from '@nestjs/common';
import { ResourcesRepliesService } from './resources-replies.service';
import { ResourcesRepliesResolver } from './resources-replies.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ResourceReplySchema,
  ResourcesReply,
} from './entities/resources-reply.entity';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';
import { ResourcesModule } from '../resources.module';
import { StartupModule } from 'src/startup/startup.module';
import { ContentModule } from 'src/content/content.module';
import { EmailsModule } from 'src/emails/emails.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UsersModule } from 'src/users/users.module';
import { EntrepreneurModule } from 'src/entrepreneur/entrepreneur.module';
import { ConfigNotificationsModule } from 'src/notifications/config-notifications/config-notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ResourcesReply.name, schema: ResourceReplySchema },
    ]),
    AuthModule,
    LoggerModule,
    forwardRef(() => ResourcesModule),
    forwardRef(() => ContentModule),
    forwardRef(() => StartupModule),
    forwardRef(() => EntrepreneurModule),
    forwardRef(() => EmailsModule),
    forwardRef(() => ConfigNotificationsModule),
    forwardRef(() => NotificationsModule),
    forwardRef(() => UsersModule),
  ],
  providers: [ResourcesRepliesResolver, ResourcesRepliesService],
  exports: [ResourcesRepliesService],
})
export class ResourcesRepliesModule {}
