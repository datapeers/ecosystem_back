import { Module, forwardRef } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentResolver } from './content.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Content, ContentSchema } from './entities/content.entity';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';
import { UserLogModule } from 'src/user-log/user-log.module';
import { ResourcesRepliesModule } from 'src/resources/resources-replies/resources-replies.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Content.name, schema: ContentSchema }]),
    AuthModule,
    LoggerModule,
    forwardRef(() => UserLogModule),
    forwardRef(() => ResourcesRepliesModule),
  ],
  providers: [ContentResolver, ContentService],
  exports: [ContentService],
})
export class ContentModule {}
