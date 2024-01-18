import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { IntegrationsService } from './integrations.service';
import { Integration } from './entities/integration.entity';
import { CreateIntegrationInput } from './dto/create-integration.input';
/**
 * @ignore
 */
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

  // @Query(() => Integration, { name: 'integrationTest' })
  // test() {
  //   return this.integrationsService.testIcs();
  // }
}
