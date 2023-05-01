import { Test, TestingModule } from '@nestjs/testing';
import { StartupResolver } from './startup.resolver';
import { StartupService } from './startup.service';

describe('StartupResolver', () => {
  let resolver: StartupResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StartupResolver, StartupService],
    }).compile();

    resolver = module.get<StartupResolver>(StartupResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
