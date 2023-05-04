import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ContentService } from './content.service';
import { Content } from './entities/content.entity';
import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';

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
  findAll(@Args('phase', { type: () => String }) phase: string) {
    return this.contentService.findAll(phase);
  }

  @Query(() => Content, { name: 'content' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.contentService.findOne(id);
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
