import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ResourcesService } from './resources.service';
import { Resource } from './entities/resource.entity';
import { CreateResourceInput } from './dto/create-resource.input';
import { UpdateResourceInput } from './dto/update-resource.input';

@Resolver(() => Resource)
export class ResourcesResolver {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Mutation(() => Resource)
  createResource(@Args('createResourceInput') createResourceInput: CreateResourceInput) {
    return this.resourcesService.create(createResourceInput);
  }

  @Query(() => [Resource], { name: 'resources' })
  findAll() {
    return this.resourcesService.findAll();
  }

  @Query(() => Resource, { name: 'resource' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.resourcesService.findOne(id);
  }

  @Mutation(() => Resource)
  updateResource(@Args('updateResourceInput') updateResourceInput: UpdateResourceInput) {
    return this.resourcesService.update(updateResourceInput.id, updateResourceInput);
  }

  @Mutation(() => Resource)
  removeResource(@Args('id', { type: () => Int }) id: number) {
    return this.resourcesService.remove(id);
  }
}
