import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DownloadsService } from './downloads.service';
import { DownloadsController } from './downloads.controller';
import { Download, DownloadSchema } from './entities/download';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Download.name, schema: DownloadSchema }]),
    AuthModule,
    UsersModule,
    StorageModule,
  ],
  controllers: [DownloadsController],
  providers: [DownloadsService],
  exports: [DownloadsService],
})
export class DownloadsModule {}
