import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TermsOfUseService } from './terms-of-use.service';
import { CreateTermsOfUseInput } from './dto/create-terms-of-use.input';
import { UpdateTermsOfUseInput } from './dto/update-terms-of-use.input';

@Resolver('TermsOfUse')
export class TermsOfUseResolver {
  constructor(private readonly termsOfUseService: TermsOfUseService) {}

  // @Mutation('createTermsOfUse')
  // create(@Args('createTermsOfUseInput') createTermsOfUseInput: CreateTermsOfUseInput) {
  //   return this.termsOfUseService.create(createTermsOfUseInput);
  // }

  @Query('termsOfUse')
  findAll() {
    return this.termsOfUseService.findAll();
  }

  @Query('termsOfUse')
  findOne(@Args('id') id: number) {
    return this.termsOfUseService.findOne(id);
  }

  @Mutation('updateTermsOfUse')
  update(
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
