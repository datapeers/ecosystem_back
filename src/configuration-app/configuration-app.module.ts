import { Module } from '@nestjs/common';
import { ConfigurationAppService } from './configuration-app.service';
import { ConfigurationAppResolver } from './configuration-app.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';
import {
  ConfigurationApp,
  ConfigurationAppSchema,
} from './entities/configuration-app.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConfigurationApp.name, schema: ConfigurationAppSchema },
    ]),
    AuthModule,
    LoggerModule,
  ],
  providers: [ConfigurationAppResolver, ConfigurationAppService],
  exports: [ConfigurationAppService],
})
export class ConfigurationAppModule {}
