import { Module } from '@nestjs/common';
import { ResourcesRepliesService } from './resources-replies.service';
import { ResourcesRepliesResolver } from './resources-replies.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ResourceReplySchema,
  ResourcesReply,
} from './entities/resources-reply.entity';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ResourcesReply.name, schema: ResourceReplySchema },
    ]),
    AuthModule,
    LoggerModule,
  ],
  providers: [ResourcesRepliesResolver, ResourcesRepliesService],
  exports: [ResourcesRepliesService],
})
export class ResourcesRepliesModule {}
