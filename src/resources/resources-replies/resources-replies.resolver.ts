import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ResourcesRepliesService } from './resources-replies.service';
import { ResourcesReply } from './entities/resources-reply.entity';
import { CreateResourcesReplyInput } from './dto/create-resources-reply.input';
import { UpdateResourcesReplyInput } from './dto/update-resources-reply.input';

@Resolver(() => ResourcesReply)
export class ResourcesRepliesResolver {
  constructor(
    private readonly resourcesRepliesService: ResourcesRepliesService,
  ) {}

  @Mutation(() => ResourcesReply)
  createResourcesReply(
    @Args('createResourcesReplyInput')
    createResourcesReplyInput: CreateResourcesReplyInput,
  ) {
    return this.resourcesRepliesService.create(createResourcesReplyInput);
  }

  @Query(() => [ResourcesReply], { name: 'resourcesReplies' })
  findAll() {
    return this.resourcesRepliesService.findAll();
  }

  @Query(() => ResourcesReply, { name: 'resourcesReply' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.resourcesRepliesService.findOne(id);
  }

  @Mutation(() => ResourcesReply)
  updateResourcesReply(
    @Args('updateResourcesReplyInput')
    updateResourcesReplyInput: UpdateResourcesReplyInput,
  ) {
    return this.resourcesRepliesService.updateDoc(
      updateResourcesReplyInput._id,
      updateResourcesReplyInput,
    );
  }

  @Mutation(() => ResourcesReply)
  removeResourcesReply(@Args('id', { type: () => String }) id: string) {
    return this.resourcesRepliesService.remove(id);
  }
}
