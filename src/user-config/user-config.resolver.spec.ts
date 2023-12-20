import { Test, TestingModule } from '@nestjs/testing';
import { UserConfigResolver } from './user-config.resolver';
import { UserConfigService } from './user-config.service';

describe('UserConfigResolver', () => {
  let resolver: UserConfigResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserConfigResolver, UserConfigService],
    }).compile();

    resolver = module.get<UserConfigResolver>(UserConfigResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
