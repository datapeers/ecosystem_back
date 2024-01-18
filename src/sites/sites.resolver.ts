import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SitesService } from './sites.service';
import { Site } from './entities/site.entity';
import { CreateSiteInput } from './dto/create-site.input';
import { UpdateSiteInput } from './dto/update-site.input';
/**
 * @ignore
 */
@Resolver(() => Site)
export class SitesResolver {
  constructor(private readonly sitesService: SitesService) {}

  @Mutation(() => Site)
  createSite(@Args('createSiteInput') createSiteInput: CreateSiteInput) {
    return this.sitesService.create(createSiteInput);
  }

  @Query(() => [Site], { name: 'sites' })
  findAll() {
    return this.sitesService.findAll();
  }

  @Query(() => Site, { name: 'site' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.sitesService.findOne(id);
  }

  @Mutation(() => Site)
  updateSite(@Args('updateSiteInput') updateSiteInput: UpdateSiteInput) {
    return this.sitesService.update(updateSiteInput._id, updateSiteInput);
  }

  @Mutation(() => Site)
  removeSite(@Args('id', { type: () => String }) id: string) {
    return this.sitesService.remove(id);
  }
}
