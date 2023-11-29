import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { IntegrationsService } from './integrations.service';
import { Integration } from './entities/integration.entity';
import { CreateIntegrationInput } from './dto/create-integration.input';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from 'src/auth/types/auth-user';
// @UseGuards(GqlAuthGuard)
@Resolver(() => Integration)
export class IntegrationsResolver {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Mutation(() => Integration)
  createIntegration(
    @Args('createIntegrationInput')
    createIntegrationInput: CreateIntegrationInput,
  ) {
    return this.integrationsService.updateOrCreate(createIntegrationInput);
  }

  @Query(() => [Integration], { name: 'integrations' })
  findAll() {
    return this.integrationsService.findAll();
  }

  @Query(() => Integration, { name: 'integrationTest' })
  test() {
    return this.integrationsService.zoomMeeting(
      'prueba meeting',
      '2023-11-30 11:26:45.018Z',
      60,
      [{ email: 'jaeducaba@gmail.com', name: 'Jairo' }],
      [{ email: 'jairo.carmona@datapeers.co' }],
    );
  }
}
