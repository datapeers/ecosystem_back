import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentResolver } from './content.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Content, ContentSchema } from './entities/content.entity';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Content.name, schema: ContentSchema }]),
    AuthModule,
    LoggerModule,
  ],
  providers: [ContentResolver, ContentService],
  exports: [ContentService],
})
export class ContentModule {}
