import { Test, TestingModule } from '@nestjs/testing';
import { TypesNotificationsResolver } from './types-notifications.resolver';
import { TypesNotificationsService } from './types-notifications.service';

describe('TypesNotificationsResolver', () => {
  let resolver: TypesNotificationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypesNotificationsResolver, TypesNotificationsService],
    }).compile();

    resolver = module.get<TypesNotificationsResolver>(TypesNotificationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
