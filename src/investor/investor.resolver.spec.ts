import { Test, TestingModule } from '@nestjs/testing';
import { InvestorResolver } from './investor.resolver';
import { InvestorService } from './investor.service';

describe('InvestorResolver', () => {
  let resolver: InvestorResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvestorResolver, InvestorService],
    }).compile();

    resolver = module.get<InvestorResolver>(InvestorResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
