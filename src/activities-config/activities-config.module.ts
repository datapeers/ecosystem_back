import { Module } from '@nestjs/common';
import { ActivitiesConfigService } from './activities-config.service';
import { ActivitiesConfigResolver } from './activities-config.resolver';

@Module({
  providers: [ActivitiesConfigResolver, ActivitiesConfigService]
})
export class ActivitiesConfigModule {}
