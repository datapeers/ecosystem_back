import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { LoggerModule } from 'src/logger/logger.module';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Event as EventEntity, EventSchema } from './entities/event.entity';
import { ActaModule } from './acta/acta.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventEntity.name, schema: EventSchema },
    ]),
    AuthModule,
    LoggerModule,
    ActaModule,
  ],
  providers: [EventsResolver, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
