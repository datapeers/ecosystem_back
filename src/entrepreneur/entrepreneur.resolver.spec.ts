import { Test, TestingModule } from '@nestjs/testing';
import { EntrepreneurResolver } from './entrepreneur.resolver';
import { EntrepreneurService } from './entrepreneur.service';

describe('EntrepreneurResolver', () => {
  let resolver: EntrepreneurResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntrepreneurResolver, EntrepreneurService],
    }).compile();

    resolver = module.get<EntrepreneurResolver>(EntrepreneurResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
