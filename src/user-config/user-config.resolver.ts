import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserConfigService } from './user-config.service';
import { UserConfig } from './entities/user-config.entity';
import { UpdateUserConfigInput } from './dto/update-user-config.input';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
/**
 * @ignore
 */
@Resolver(() => UserConfig)
@UseGuards(GqlAuthGuard)
export class UserConfigResolver {
  constructor(private readonly userConfigService: UserConfigService) {}

  @Query(() => UserConfig, { name: 'userConfig' })
  findOne(@Args('uid', { type: () => String }) uid: string) {
    return this.userConfigService.findOne(uid);
  }

  @Mutation(() => UserConfig)
  updateUserConfig(
    @Args('updateUserConfigInput') updateUserConfigInput: UpdateUserConfigInput,
    @CurrentUser([]) user: User,
  ) {
    if (user.uid != updateUserConfigInput.uid)
      throw new UnauthorizedException(
        'Cant update user config from another user.',
      );
    return this.userConfigService.update(updateUserConfigInput, user);
  }
}
