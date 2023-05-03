import { Test, TestingModule } from '@nestjs/testing';
import { ResponsibleResolver } from './responsible.resolver';
import { ResponsibleService } from './responsible.service';

describe('ResponsibleResolver', () => {
  let resolver: ResponsibleResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponsibleResolver, ResponsibleService],
    }).compile();

    resolver = module.get<ResponsibleResolver>(ResponsibleResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
