import { Module } from '@nestjs/common';
import { PhasesService } from './phases.service';
import { PhasesResolver } from './phases.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Phase, PhaseSchema } from './entities/phase.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { LoggerModule } from 'src/logger/logger.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Phase.name, schema: PhaseSchema }]),
    AuthModule,
    UsersModule,
    LoggerModule,
  ],
  providers: [PhasesResolver, PhasesService],
  exports: [PhasesService],
})
export class PhasesModule {}
