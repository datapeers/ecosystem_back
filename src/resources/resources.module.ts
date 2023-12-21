import { Module, forwardRef } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesResolver } from './resources.resolver';
import { Resource, ResourceSchema } from './entities/resource.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';
import { ContentModule } from 'src/content/content.module';
import { ResourcesRepliesModule } from './resources-replies/resources-replies.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resource.name, schema: ResourceSchema },
    ]),
    AuthModule,
    LoggerModule,
    forwardRef(() => ContentModule),
  ],
  providers: [ResourcesResolver, ResourcesService],
  exports: [ResourcesService],
})
export class ResourcesModule {}
