import { Test, TestingModule } from '@nestjs/testing';
import { TableConfigService } from './table-config.service';

describe('TableConfigService', () => {
  let service: TableConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TableConfigService],
    }).compile();

    service = module.get<TableConfigService>(TableConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
