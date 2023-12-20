import { Test, TestingModule } from '@nestjs/testing';
import { ConfigNotificationsService } from './config-notifications.service';

describe('ConfigNotificationsService', () => {
  let service: ConfigNotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigNotificationsService],
    }).compile();

    service = module.get<ConfigNotificationsService>(ConfigNotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
