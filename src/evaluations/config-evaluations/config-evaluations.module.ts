import { Module } from '@nestjs/common';
import { ConfigEvaluationsService } from './config-evaluations.service';
import { ConfigEvaluationsResolver } from './config-evaluations.resolver';
import { LoggerModule } from 'src/logger/logger.module';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConfigEvaluation,
  ConfigEvaluationSchema,
} from './entities/config-evaluation.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConfigEvaluation.name, schema: ConfigEvaluationSchema },
    ]),
    AuthModule,
    LoggerModule,
  ],
  providers: [ConfigEvaluationsResolver, ConfigEvaluationsService],
  exports: [ConfigEvaluationsService],
})
export class ConfigEvaluationsModule {}
