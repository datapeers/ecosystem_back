import { Module } from '@nestjs/common';
import { RatingConfigService } from './rating-config.service';
import { RatingConfigResolver } from './rating-config.resolver';
/**
 * @ignore
 */
@Module({
  providers: [RatingConfigResolver, RatingConfigService],
})
export class RatingConfigModule {}
