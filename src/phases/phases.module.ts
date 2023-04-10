import { Module } from '@nestjs/common';
import { PhasesService } from './phases.service';
import { PhasesResolver } from './phases.resolver';

@Module({
  providers: [PhasesResolver, PhasesService]
})
export class PhasesModule {}
