import { Test, TestingModule } from '@nestjs/testing';
import { ConfigNotificationsResolver } from './config-notifications.resolver';
import { ConfigNotificationsService } from './config-notifications.service';

describe('ConfigNotificationsResolver', () => {
  let resolver: ConfigNotificationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigNotificationsResolver, ConfigNotificationsService],
    }).compile();

    resolver = module.get<ConfigNotificationsResolver>(ConfigNotificationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
