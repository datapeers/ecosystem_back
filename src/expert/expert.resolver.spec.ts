import { Test, TestingModule } from '@nestjs/testing';
import { ExpertResolver } from './expert.resolver';
import { ExpertService } from './expert.service';

describe('ExpertResolver', () => {
  let resolver: ExpertResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExpertResolver, ExpertService],
    }).compile();

    resolver = module.get<ExpertResolver>(ExpertResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
