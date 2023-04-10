import { Test, TestingModule } from '@nestjs/testing';
import { InvitationsResolver } from './invitations.resolver';
import { InvitationsService } from './invitations.service';

describe('InvitationsResolver', () => {
  let resolver: InvitationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvitationsResolver, InvitationsService],
    }).compile();

    resolver = module.get<InvitationsResolver>(InvitationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
