import { Module, forwardRef } from '@nestjs/common';
import { ResourcesRepliesService } from './resources-replies.service';
import { ResourcesRepliesResolver } from './resources-replies.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ResourceReplySchema,
  ResourcesReply,
} from './entities/resources-reply.entity';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';
import { ResourcesModule } from '../resources.module';
import { StartupModule } from 'src/startup/startup.module';
import { ContentModule } from 'src/content/content.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ResourcesReply.name, schema: ResourceReplySchema },
    ]),
    AuthModule,
    LoggerModule,
    forwardRef(() => ResourcesModule),
    forwardRef(() => ContentModule),
    forwardRef(() => StartupModule),
  ],
  providers: [ResourcesRepliesResolver, ResourcesRepliesService],
  exports: [ResourcesRepliesService],
})
export class ResourcesRepliesModule {}
