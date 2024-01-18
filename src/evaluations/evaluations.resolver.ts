import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { EvaluationsService } from './evaluations.service';
import { Evaluation } from './entities/evaluation.entity';
import { CreateEvaluationInput } from './dto/create-evaluation.input';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from 'src/auth/types/auth-user';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { UseGuards } from '@nestjs/common';
/**
 * @ignore
 */
@UseGuards(GqlAuthGuard)
@Resolver(() => Evaluation)
export class EvaluationsResolver {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Mutation(() => Evaluation)
  createEvaluation(
    @Args('createEvaluationInput') createEvaluationInput: CreateEvaluationInput,
  ) {
    return this.evaluationsService.create(createEvaluationInput);
  }

  @Query(() => [Evaluation], { name: 'evaluations' })
  findAll() {
    return this.evaluationsService.findAll();
  }

  @Query(() => [Evaluation], { name: 'evaluationsByConfig' })
  findByConfig(
    @Args('config', { type: () => String }) config: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.evaluationsService.findByConfig(config, user);
  }

  @Query(() => Evaluation, { name: 'evaluation' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.evaluationsService.findOne(id);
  }

  @Query(() => Evaluation, { name: 'evaluationByReviewer', nullable: true })
  findByReviewer(
    @Args('reviewer', { type: () => String }) reviewer: string,
    @Args('config', { type: () => String }) config: string,
    @Args('evaluated', { type: () => String }) evaluated: string,
  ) {
    return this.evaluationsService.findOneByReviewer(
      reviewer,
      config,
      evaluated,
    );
  }

  @Mutation(() => Evaluation)
  removeEvaluation(@Args('ids', { type: () => [String] }) ids: [string]) {
    return this.evaluationsService.delete(ids);
  }

  @ResolveField('evaluatedName', () => String)
  resolveIsProspect(@Parent() ev: Omit<Evaluation, 'evaluatedName'>) {
    return this.evaluationsService.getName(ev);
  }
}
