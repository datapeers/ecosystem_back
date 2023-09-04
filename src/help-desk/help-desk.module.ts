import { Module } from '@nestjs/common';
import { HelpDeskService } from './help-desk.service';
import { HelpDeskResolver } from './help-desk.resolver';
import { TicketCategoriesModule } from './categories/categories.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HelpDeskTicket,
  HelpDeskTicketSchema,
} from './entities/help-desk.entity';

@Module({
  providers: [HelpDeskResolver, HelpDeskService],
  imports: [
    MongooseModule.forFeature([
      { name: HelpDeskTicket.name, schema: HelpDeskTicketSchema },
    ]),
    TicketCategoriesModule,
  ],
})
export class HelpDeskModule {}
