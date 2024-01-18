import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ResourcesService } from './resources.service';
import { Resource } from './entities/resource.entity';
import { CreateResourceInput } from './dto/create-resource.input';
import { UpdateResourceInput } from './dto/update-resource.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
/**
 * @ignore
 */
@UseGuards(GqlAuthGuard)
@Resolver(() => Resource)
export class ResourcesResolver {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Mutation(() => Resource)
  createResource(
    @Args('createResourceInput') createResourceInput: CreateResourceInput,
  ) {
    return this.resourcesService.create(createResourceInput);
  }

  @Query(() => [Resource], { name: 'resourcesByResource' })
  findAllByContent(
    @Args('contentId', { type: () => String }) contentId: string,
  ) {
    return this.resourcesService.findAllByContent(contentId);
  }

  @Query(() => [Resource], { name: 'resourcesByPhase' })
  findAllByPhase(@Args('phaseId', { type: () => String }) phaseId: string) {
    return this.resourcesService.findAllByPhase(phaseId);
  }

  @Query(() => Resource, { name: 'resource' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.resourcesService.findOne(id);
  }

  @Mutation(() => Resource)
  updateResource(
    @Args('updateResourceInput') updateResourceInput: UpdateResourceInput,
  ) {
    return this.resourcesService.update(
      updateResourceInput._id,
      updateResourceInput,
    );
  }

  @Mutation(() => Resource)
  removeResource(@Args('id', { type: () => String }) id: string) {
    return this.resourcesService.remove(id);
  }
}
