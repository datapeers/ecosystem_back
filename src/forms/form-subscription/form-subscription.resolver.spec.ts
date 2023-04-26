import { Test, TestingModule } from '@nestjs/testing';
import { FormSubscriptionResolver } from './form-subscription.resolver';
import { FormSubscriptionService } from './form-subscription.service';

describe('FormSubscriptionResolver', () => {
  let resolver: FormSubscriptionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormSubscriptionResolver, FormSubscriptionService],
    }).compile();

    resolver = module.get<FormSubscriptionResolver>(FormSubscriptionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
