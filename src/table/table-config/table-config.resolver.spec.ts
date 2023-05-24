import { Test, TestingModule } from '@nestjs/testing';
import { TableConfigResolver } from './table-config.resolver';
import { TableConfigService } from './table-config.service';

describe('TableConfigResolver', () => {
  let resolver: TableConfigResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TableConfigResolver, TableConfigService],
    }).compile();

    resolver = module.get<TableConfigResolver>(TableConfigResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
