import { Module } from '@nestjs/common';
import { ActivitiesConfigService } from './activities-config.service';
import { ActivitiesConfigResolver } from './activities-config.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ActivitiesConfig,
  ActivitiesConfigSchema,
} from './entities/activities-config.entity';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivitiesConfig.name, schema: ActivitiesConfigSchema },
    ]),
    AuthModule,
    LoggerModule,
  ],
  providers: [ActivitiesConfigResolver, ActivitiesConfigService],
  exports: [ActivitiesConfigService],
})
export class ActivitiesConfigModule {}
