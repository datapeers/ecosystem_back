import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { TicketCategoriesService } from './categories.service';
import { TicketCategory } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
/**
 * @ignore
 */
@Resolver(() => TicketCategory)
export class CategoriesResolver {
  constructor(private readonly categoriesService: TicketCategoriesService) {}

  @Mutation(() => TicketCategory)
  createCategory(
    @Args('createTicketCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoriesService.create(createCategoryInput);
  }

  @Query(() => [TicketCategory], { name: 'categories' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Query(() => TicketCategory, { name: 'category' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Mutation(() => TicketCategory)
  updateCategory(
    @Args('updateTicketCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoriesService.update(
      updateCategoryInput._id,
      updateCategoryInput,
    );
  }

  @Mutation(() => TicketCategory)
  removeCategory(@Args('id', { type: () => ID }) id: string) {
    return this.categoriesService.remove(id);
  }
}
