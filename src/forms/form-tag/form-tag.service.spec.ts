import { Test, TestingModule } from '@nestjs/testing';
import { FormTagService } from './form-tag.service';

describe('FormTagService', () => {
  let service: FormTagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormTagService],
    }).compile();

    service = module.get<FormTagService>(FormTagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
