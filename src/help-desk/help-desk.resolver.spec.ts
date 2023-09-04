import { Test, TestingModule } from '@nestjs/testing';
import { HelpDeskResolver } from './help-desk.resolver';
import { HelpDeskService } from './help-desk.service';

describe('HelpDeskResolver', () => {
  let resolver: HelpDeskResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelpDeskResolver, HelpDeskService],
    }).compile();

    resolver = module.get<HelpDeskResolver>(HelpDeskResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
