import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingResolver } from './rating.resolver';
import { RatingConfigModule } from './rating-config/rating-config.module';

@Module({
  providers: [RatingResolver, RatingService],
  imports: [RatingConfigModule],
})
export class RatingModule {}
