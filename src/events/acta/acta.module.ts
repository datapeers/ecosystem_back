import { Module } from '@nestjs/common';
import { ActaService } from './acta.service';
import { ActaResolver } from './acta.resolver';
import { LoggerModule } from 'src/logger/logger.module';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Acta, ActaSchema } from './entities/acta.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Acta.name, schema: ActaSchema }]),
    AuthModule,
    LoggerModule,
  ],
  providers: [ActaResolver, ActaService],
  exports: [ActaService],
})
export class ActaModule {}
