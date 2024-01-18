import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { StagesService } from './stages.service';
import { Stage } from './entities/stage.entity';
import { CreateStageInput } from './dto/create-stage.input';
import { UpdateStageInput } from './dto/update-stage.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
/**
 * @ignore
 */
@UseGuards(GqlAuthGuard)
@Resolver(() => Stage)
export class StagesResolver {
  constructor(private readonly stagesService: StagesService) {}

  @Mutation(() => Stage)
  createStage(@Args('createStageInput') createStageInput: CreateStageInput) {
    return this.stagesService.create(createStageInput);
  }

  @Query(() => [Stage], { name: 'stages' })
  findAll() {
    return this.stagesService.findAll();
  }

  @Query(() => Stage, { name: 'stage' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.stagesService.findOne(id);
  }

  @Mutation(() => Stage)
  updateStage(@Args('updateStageInput') updateStageInput: UpdateStageInput) {
    return this.stagesService.update(updateStageInput._id, updateStageInput);
  }

  @Mutation(() => Stage)
  updateStageIndex(
    @Args('stageId', { type: () => String }) stageId: string,
    @Args('newIndex', { type: () => Int }) newIndex: number,
    @Args('typeChange', { type: () => String }) typeChange: 'up' | 'down',
  ) {
    return this.stagesService.modifyIndex(stageId, newIndex, typeChange);
  }

  @Mutation(() => Stage)
  removeStage(@Args('id', { type: () => String }) id: string) {
    return this.stagesService.remove(id);
  }
}
