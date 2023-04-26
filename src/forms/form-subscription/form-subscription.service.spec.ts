import { Test, TestingModule } from '@nestjs/testing';
import { FormSubscriptionService } from './form-subscription.service';

describe('FormSubscriptionService', () => {
  let service: FormSubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormSubscriptionService],
    }).compile();

    service = module.get<FormSubscriptionService>(FormSubscriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
