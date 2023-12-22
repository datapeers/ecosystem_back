import { Module, forwardRef } from '@nestjs/common';
import { PhasesService } from './phases.service';
import { PhasesResolver } from './phases.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Phase, PhaseSchema } from './entities/phase.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { LoggerModule } from 'src/logger/logger.module';
import { ContentModule } from 'src/content/content.module';
import { ActivitiesConfigModule } from 'src/activities-config/activities-config.module';
import { ResourcesModule } from 'src/resources/resources.module';
import { ExpertModule } from 'src/expert/expert.module';
import { StartupModule } from 'src/startup/startup.module';
import { StagesModule } from 'src/stages/stages.module';
import { ResourcesRepliesModule } from 'src/resources/resources-replies/resources-replies.module';
import { UserLogModule } from 'src/user-log/user-log.module';
import { ConfigNotificationsModule } from 'src/notifications/config-notifications/config-notifications.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Phase.name, schema: PhaseSchema }]),
    AuthModule,
    UsersModule,
    LoggerModule,
    ContentModule,
    ResourcesModule,
    forwardRef(() => ExpertModule),
    forwardRef(() => StartupModule),
    forwardRef(() => StagesModule),
    forwardRef(() => ResourcesRepliesModule),
    forwardRef(() => UserLogModule),
    forwardRef(() => ConfigNotificationsModule),
    forwardRef(() => NotificationsModule),
    ActivitiesConfigModule,
  ],
  providers: [PhasesResolver, PhasesService],
  exports: [PhasesService],
})
export class PhasesModule {}
