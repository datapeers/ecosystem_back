import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { AwsService } from './aws/aws.service';
import { StorageService } from './models/storage-service';

@Module({
  controllers: [StorageController],
  providers: [
    {
      provide: StorageService,
      useClass: AwsService,
    }
  ],
  exports: [
    StorageService,
  ]
})
export class StorageModule {}
