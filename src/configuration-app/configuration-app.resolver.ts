import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ConfigurationAppService } from './configuration-app.service';
import { ConfigurationApp } from './entities/configuration-app.entity';
import { UpdateConfigurationAppInput } from './dto/update-configuration-app.input';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { UseGuards, forwardRef, Inject } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from '../auth/types/auth-user';
import { GraphQLJSONObject } from 'graphql-scalars';
import { UserLogService } from 'src/user-log/user-log.service';
import { UsersService } from 'src/users/users.service';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
/**
 * @ignore
 */
@UseGuards(GqlAuthGuard)
@Resolver(() => ConfigurationApp)
export class ConfigurationAppResolver {
  constructor(
    private readonly configurationAppService: ConfigurationAppService,
    private readonly userService: UsersService,
  ) {}

  @Query(() => ConfigurationApp, { name: 'configurationApp' })
  findOne(@CurrentUser() user: AuthUser) {
    return this.configurationAppService.find();
  }

  @Mutation(() => ConfigurationApp)
  updateConfigurationApp(
    @Args('updateConfigurationAppInput')
    updateConfigurationAppInput: UpdateConfigurationAppInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.configurationAppService.update(
      updateConfigurationAppInput._id,
      updateConfigurationAppInput,
    );
  }

  @ResolveField('initGraph', () => GraphQLJSONObject)
  resolveExpertHours(
    @Parent() config: Omit<ConfigurationApp, 'initGraph'>,
    @CurrentUser() user: AuthUser,
  ) {
    return this.configurationAppService.initGraph(user);
  }

  @ResolveField('countUsers', () => Number)
  countUsers(
    @Parent() config: Omit<ConfigurationApp, 'initGraph'>,
    @CurrentUser() user: AuthUser,
  ) {
    const ignore = [ValidRoles.user, ValidRoles.expert];
    if (ignore.includes(user.rolDoc.type as ValidRoles)) {
      return 0;
    }
    return this.userService.countAll();
  }
}
