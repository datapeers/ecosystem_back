import { Test, TestingModule } from '@nestjs/testing';
import { FormTagResolver } from './form-tag.resolver';
import { FormTagService } from './form-tag.service';

describe('FormTagResolver', () => {
  let resolver: FormTagResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormTagResolver, FormTagService],
    }).compile();

    resolver = module.get<FormTagResolver>(FormTagResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
