import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
} from '@nestjs/graphql';
import { UserLogService } from './user-log.service';
import { UserLog } from './entities/user-log.entity';
import { CreateUserLogInput } from './dto/create-user-log.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from '../auth/types/auth-user';
import GraphQLJSON from 'graphql-type-json';
/**
 * @ignore
 */
@UseGuards(GqlAuthGuard)
@Resolver(() => UserLog)
export class UserLogResolver {
  constructor(private readonly userLogService: UserLogService) {}

  @Mutation(() => UserLog)
  createUserLog(
    @Args('createUserLogInput')
    createUserLogInput: CreateUserLogInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.userLogService.create(createUserLogInput, user);
  }

  @Query(() => [UserLog], { name: 'userLogs' })
  findByFilters(@Args('filters', { type: () => GraphQLJSON }) filters: any) {
    return this.userLogService.findByFilters(filters);
  }

  @Query(() => UserLog, { name: 'userLog' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.userLogService.findOne(id);
  }

  @Mutation(() => UserLog)
  removeUserLog(@Args('id', { type: () => String }) id: string) {
    return this.userLogService.remove(id);
  }
}
