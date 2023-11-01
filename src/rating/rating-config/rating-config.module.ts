import { Module } from '@nestjs/common';
import { RatingConfigService } from './rating-config.service';
import { RatingConfigResolver } from './rating-config.resolver';

@Module({
  providers: [RatingConfigResolver, RatingConfigService],
})
export class RatingConfigModule {}
