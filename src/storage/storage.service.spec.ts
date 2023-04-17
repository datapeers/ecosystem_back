import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './models/storage-service';
import { AwsService } from './aws/aws.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: StorageService,
        useClass: AwsService,
      }],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
