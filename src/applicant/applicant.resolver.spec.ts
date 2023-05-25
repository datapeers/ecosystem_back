import { Test, TestingModule } from '@nestjs/testing';
import { ApplicantResolver } from './applicant.resolver';
import { ApplicantService } from './applicant.service';

describe('ApplicantResolver', () => {
  let resolver: ApplicantResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicantResolver, ApplicantService],
    }).compile();

    resolver = module.get<ApplicantResolver>(ApplicantResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
