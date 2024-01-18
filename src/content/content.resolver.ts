import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ContentService } from './content.service';
import { Content } from './entities/content.entity';
import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from '../auth/types/auth-user';
import { LastContentOutput } from './dto/last-content-output';
/**
 * @ignore
 */
@UseGuards(GqlAuthGuard)
@Resolver(() => Content)
export class ContentResolver {
  constructor(private readonly contentService: ContentService) {}

  @Mutation(() => Content)
  createContent(
    @Args('createContentInput') createContentInput: CreateContentInput,
  ) {
    return this.contentService.create(createContentInput);
  }

  @Query(() => [Content], { name: 'allContent' })
  findAll(
    @Args('phase', { type: () => String }) phase: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.contentService.findAll(phase, user);
  }

  @Query(() => Content, { name: 'content' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.contentService.findOne(id);
  }

  @Query(() => LastContentOutput, { name: 'lastContent' })
  findLastContent(
    @Args('batchId', { type: () => String }) batchId: string,
    @Args('startupId', { type: () => String }) startupId: string,
  ) {
    return this.contentService.findLastContent(batchId, startupId);
  }

  @Mutation(() => Content)
  updateContent(
    @Args('updateContentInput') updateContentInput: UpdateContentInput,
  ) {
    return this.contentService.update(
      updateContentInput._id,
      updateContentInput,
    );
  }

  @Mutation(() => Content)
  removeContent(@Args('id', { type: () => String }) id: string) {
    return this.contentService.remove(id);
  }
}
