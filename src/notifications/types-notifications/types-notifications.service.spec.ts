import { Test, TestingModule } from '@nestjs/testing';
import { TypesNotificationsService } from './types-notifications.service';

describe('TypesNotificationsService', () => {
  let service: TypesNotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypesNotificationsService],
    }).compile();

    service = module.get<TypesNotificationsService>(TypesNotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
