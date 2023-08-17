import { Module } from '@nestjs/common';
import { UserLogService } from './user-log.service';
import { UserLogResolver } from './user-log.resolver';
import { LoggerModule } from 'src/logger/logger.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserLog, UserLogSchema } from './entities/user-log.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserLog.name, schema: UserLogSchema }]),
    AuthModule,
    LoggerModule,
    // forwardRef(() => ResourcesModule),
    // forwardRef(() => ContentModule),
    // forwardRef(() => StartupModule),
  ],
  providers: [UserLogResolver, UserLogService],
  exports: [UserLogService],
})
export class UserLogModule {}
