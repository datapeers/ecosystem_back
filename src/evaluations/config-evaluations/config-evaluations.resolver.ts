import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ConfigEvaluationsService } from './config-evaluations.service';
import { ConfigEvaluation } from './entities/config-evaluation.entity';
import { CreateConfigEvaluationInput } from './dto/create-config-evaluation.input';
import { UpdateConfigEvaluationInput } from './dto/update-config-evaluation.input';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from 'src/auth/types/auth-user';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { UseGuards } from '@nestjs/common';
/**
 * @ignore
 */
@UseGuards(GqlAuthGuard)
@Resolver(() => ConfigEvaluation)
export class ConfigEvaluationsResolver {
  constructor(
    private readonly configEvaluationsService: ConfigEvaluationsService,
  ) {}

  @Mutation(() => ConfigEvaluation)
  createConfigEvaluation(
    @Args('createConfigEvaluationInput')
    createConfigEvaluationInput: CreateConfigEvaluationInput,
  ) {
    return this.configEvaluationsService.create(createConfigEvaluationInput);
  }

  @Query(() => [ConfigEvaluation], { name: 'configEvaluations' })
  findAll() {
    return this.configEvaluationsService.findAll();
  }

  @Query(() => [ConfigEvaluation], { name: 'configEvaluationsByPhase' })
  findByPhase(
    @Args('phase', { type: () => String }) phase: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.configEvaluationsService.findByPhase(phase, user);
  }

  @Query(() => ConfigEvaluation, { name: 'configEvaluation' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.configEvaluationsService.findOne(id);
  }

  @Mutation(() => ConfigEvaluation)
  updateConfigEvaluation(
    @Args('updateConfigEvaluationInput')
    updateConfigEvaluationInput: UpdateConfigEvaluationInput,
  ) {
    return this.configEvaluationsService.update(
      updateConfigEvaluationInput._id,
      updateConfigEvaluationInput,
    );
  }

  @Mutation(() => ConfigEvaluation)
  removeConfigEvaluation(@Args('id', { type: () => String }) id: string) {
    return this.configEvaluationsService.remove(id);
  }
}
