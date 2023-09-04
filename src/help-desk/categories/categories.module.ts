import { Module } from '@nestjs/common';
import { TicketCategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TicketCategory,
  TicketCategorySchema,
} from './entities/category.entity';

@Module({
  providers: [CategoriesResolver, TicketCategoriesService],
  imports: [
    MongooseModule.forFeature([
      { name: TicketCategory.name, schema: TicketCategorySchema },
    ]),
  ],
})
export class TicketCategoriesModule {}
