import { Module } from '@nestjs/common';
import { UserConfigService } from './user-config.service';
import { UserConfigResolver } from './user-config.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { UserConfig, UserConfigSchema } from './entities/user-config.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigNotificationsModule } from 'src/notifications/config-notifications/config-notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserConfig.name, schema: UserConfigSchema },
    ]),
    AuthModule,
    ConfigNotificationsModule,
  ],
  providers: [UserConfigResolver, UserConfigService],
})
export class UserConfigModule {}
