import { Module, forwardRef } from '@nestjs/common';
import { ConfigurationAppService } from './configuration-app.service';
import { ConfigurationAppResolver } from './configuration-app.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';
import {
  ConfigurationApp,
  ConfigurationAppSchema,
} from './entities/configuration-app.entity';
import { UserLogModule } from 'src/user-log/user-log.module';
import { UsersModule } from 'src/users/users.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConfigurationApp.name, schema: ConfigurationAppSchema },
    ]),
    AuthModule,
    LoggerModule,
    forwardRef(() => UserLogModule),
    forwardRef(() => UsersModule),
    forwardRef(() => EventsModule),
  ],
  providers: [ConfigurationAppResolver, ConfigurationAppService],
  exports: [ConfigurationAppService],
})
export class ConfigurationAppModule {}
