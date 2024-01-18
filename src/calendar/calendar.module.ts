import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';

/**
 * @ignore
 */
@Module({
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
