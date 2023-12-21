import { Module, forwardRef } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { LoggerModule } from 'src/logger/logger.module';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Event as EventEntity, EventSchema } from './entities/event.entity';
import { ActaModule } from './acta/acta.module';
import { ExpertModule } from 'src/expert/expert.module';
import { StartupModule } from 'src/startup/startup.module';
import { UsersModule } from 'src/users/users.module';
import { EntrepreneurModule } from 'src/entrepreneur/entrepreneur.module';
import { PhasesModule } from 'src/phases/phases.module';
import { ParticipationEventsModule } from './participation-events/participation-events.module';
import { IntegrationsModule } from 'src/integrations/integrations.module';
import { EmailsModule } from 'src/emails/emails.module';
import { ConfigNotificationsModule } from 'src/notifications/config-notifications/config-notifications.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventEntity.name, schema: EventSchema },
    ]),
    AuthModule,
    LoggerModule,
    ActaModule,
    ParticipationEventsModule,
    forwardRef(() => ExpertModule),
    forwardRef(() => StartupModule),
    forwardRef(() => EntrepreneurModule),
    forwardRef(() => PhasesModule),
    forwardRef(() => IntegrationsModule),
    forwardRef(() => EmailsModule),
    forwardRef(() => ConfigNotificationsModule),
    forwardRef(() => NotificationsModule),
    forwardRef(() => UsersModule),
  ],
  providers: [EventsResolver, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
