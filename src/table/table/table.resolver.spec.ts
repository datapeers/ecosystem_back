import { Test, TestingModule } from '@nestjs/testing';
import { TableResolver } from './table.resolver';
import { TableService } from './table.service';

describe('TableResolver', () => {
  let resolver: TableResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TableResolver, TableService],
    }).compile();

    resolver = module.get<TableResolver>(TableResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
