import { PartialType } from '@nestjs/mapped-types';
import { CreateCalendarDto } from './create-calendar.dto';

/**
 * @ignore
 */
export class UpdateCalendarDto extends PartialType(CreateCalendarDto) {}
