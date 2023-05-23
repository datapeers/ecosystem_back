import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypesEventsService } from './types-events.service';
import { TypesEventsResolver } from './types-events.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';
import { TypesEvent, TypesEventSchema } from './entities/types-event.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TypesEvent.name, schema: TypesEventSchema },
    ]),
    AuthModule,
    LoggerModule,
  ],

  providers: [TypesEventsResolver, TypesEventsService],
  exports: [TypesEventsService],
})
export class TypesEventsModule {}
