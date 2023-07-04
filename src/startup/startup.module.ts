import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StartupService } from './startup.service';
import { StartupResolver } from './startup.resolver';
import { Startup, StartupSchema } from './entities/startup.entity';
import { AuthModule } from 'src/auth/auth.module';
import { EntrepreneurModule } from 'src/entrepreneur/entrepreneur.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Startup.name, schema: StartupSchema }]),
    AuthModule,
    forwardRef(() => EntrepreneurModule),
  ],
  providers: [StartupResolver, StartupService],
  exports: [StartupService],
})
export class StartupModule {}
