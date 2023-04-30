import { Test, TestingModule } from '@nestjs/testing';
import { AuthCodeResolver } from './auth-code.resolver';
import { AuthCodeService } from './auth-code.service';

describe('AuthCodeResolver', () => {
  let resolver: AuthCodeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthCodeResolver, AuthCodeService],
    }).compile();

    resolver = module.get<AuthCodeResolver>(AuthCodeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
