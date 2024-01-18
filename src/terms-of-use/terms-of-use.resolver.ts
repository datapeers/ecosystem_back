import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TermsOfUseService } from './terms-of-use.service';
import { UpdateTermsOfUseInput } from './dto/update-terms-of-use.input';
import { TermsOfUse } from './entities/terms-of-use.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
/**
 * @ignore
 */
@UseGuards(GqlAuthGuard)
@Resolver(() => TermsOfUse)
export class TermsOfUseResolver {
  constructor(private readonly termsOfUseService: TermsOfUseService) {}

  // @Mutation('createTermsOfUse')
  // create(@Args('createTermsOfUseInput') createTermsOfUseInput: CreateTermsOfUseInput) {
  //   return this.termsOfUseService.create(createTermsOfUseInput);
  // }

  @Query(() => [TermsOfUse], { name: 'termsOfUse' })
  findAll() {
    return this.termsOfUseService.findAll();
  }

  @Query(() => TermsOfUse, { name: 'termsOfUseByName' })
  findOne(@Args('name') name: string) {
    return this.termsOfUseService.findOne(name);
  }

  @Mutation(() => TermsOfUse)
  updateTermsOfUse(
    @Args('updateTermsOfUseInput') updateTermsOfUseInput: UpdateTermsOfUseInput,
  ) {
    return this.termsOfUseService.update(
      updateTermsOfUseInput._id,
      updateTermsOfUseInput,
    );
  }

  // @Mutation('removeTermsOfUse')
  // remove(@Args('id') id: number) {
  //   return this.termsOfUseService.remove(id);
  // }
}
