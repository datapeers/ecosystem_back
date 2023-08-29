import { Module } from '@nestjs/common';
import { ParticipationEventsService } from './participation-events.service';
import { ParticipationEventsResolver } from './participation-events.resolver';
import { LoggerModule } from 'src/logger/logger.module';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ParticipationEvent,
  ParticipationEventSchema,
} from './entities/participation-event.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ParticipationEvent.name, schema: ParticipationEventSchema },
    ]),
    AuthModule,
    LoggerModule,
  ],
  providers: [ParticipationEventsResolver, ParticipationEventsService],
  exports: [ParticipationEventsService],
})
export class ParticipationEventsModule {}
