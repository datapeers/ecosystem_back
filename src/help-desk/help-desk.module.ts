import { Module, forwardRef } from '@nestjs/common';
import { HelpDeskService } from './help-desk.service';
import { HelpDeskResolver } from './help-desk.resolver';
import { TicketCategoriesModule } from './categories/categories.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HelpDeskTicket,
  HelpDeskTicketSchema,
} from './entities/help-desk.entity';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';
import { StartupModule } from 'src/startup/startup.module';
import { EntrepreneurModule } from 'src/entrepreneur/entrepreneur.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HelpDeskTicket.name, schema: HelpDeskTicketSchema },
    ]),
    AuthModule,
    LoggerModule,
    forwardRef(() => StartupModule),
    forwardRef(() => EntrepreneurModule),
    forwardRef(() => NotificationsModule),
  ],
  providers: [HelpDeskResolver, HelpDeskService],
  exports: [HelpDeskService],
})
export class HelpDeskModule {}
