import { Module } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsResolver } from './evaluations.resolver';

import { ConfigEvaluationsModule } from './config-evaluations/config-evaluations.module';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Evaluation, EvaluationSchema } from './entities/evaluation.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Evaluation.name, schema: EvaluationSchema },
    ]),
    AuthModule,
    LoggerModule,
    ConfigEvaluationsModule,
  ],
  providers: [EvaluationsResolver, EvaluationsService],
  exports: [EvaluationsService],
})
export class EvaluationsModule {}
