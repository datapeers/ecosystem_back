import { Test, TestingModule } from '@nestjs/testing';
import { StorageController } from './storage.controller';
import { StorageService } from './models/storage-service';
import { AwsService } from './aws/aws.service';

describe('StorageController', () => {
  let controller: StorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageController],
      providers: [{
        provide: StorageService,
        useClass: AwsService
      }],
    }).compile();

    controller = module.get<StorageController>(StorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
