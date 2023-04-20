import { Module } from '@nestjs/common';
import { StagesService } from './stages.service';
import { StagesResolver } from './stages.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Stage, StageSchema } from './entities/stage.entity';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stage.name, schema: StageSchema }]),
    AuthModule,
    LoggerModule,
  ],
  providers: [StagesResolver, StagesService],
  exports: [StagesService],
})
export class StagesModule {}
