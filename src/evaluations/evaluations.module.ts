import { Module, forwardRef } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsResolver } from './evaluations.resolver';

import { ConfigEvaluationsModule } from './config-evaluations/config-evaluations.module';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Evaluation, EvaluationSchema } from './entities/evaluation.entity';
import { UsersModule } from 'src/users/users.module';
import { ExpertModule } from 'src/expert/expert.module';
import { StartupModule } from 'src/startup/startup.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Evaluation.name, schema: EvaluationSchema },
    ]),
    AuthModule,
    LoggerModule,
    forwardRef(() => ConfigEvaluationsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => ExpertModule),
    forwardRef(() => StartupModule),
  ],
  providers: [EvaluationsResolver, EvaluationsService],
  exports: [EvaluationsService],
})
export class EvaluationsModule {}
