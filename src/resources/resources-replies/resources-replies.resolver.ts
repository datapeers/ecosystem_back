import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ResourcesRepliesService } from './resources-replies.service';
import { ResourcesReply } from './entities/resources-reply.entity';
import { CreateResourcesReplyInput } from './dto/create-resources-reply.input';
import { UpdateResourcesReplyInput } from './dto/update-resources-reply.input';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from 'src/auth/types/auth-user';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { UseGuards } from '@nestjs/common';
/**
 * @ignore
 */
@UseGuards(GqlAuthGuard)
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

  @Query(() => [ResourcesReply], { name: 'resourcesReplyByResource' })
  findByResource(
    @Args('resource', { type: () => String }) resource: string,
    @Args('sprint', { type: () => String }) sprint: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.resourcesRepliesService.findByResource(resource, sprint, user);
  }

  @Query(() => [ResourcesReply], { name: 'resourcesReplyByStartup' })
  findByStartup(
    @Args('startup', { type: () => String }) startup: string,
    @Args('phase', { type: () => String }) phase: string,
  ) {
    return this.resourcesRepliesService.findByStartup(startup, phase);
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
