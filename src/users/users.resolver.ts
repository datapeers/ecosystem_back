import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UseGuards, MethodNotAllowedException } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { AuthUser } from '../auth/types/auth-user';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { FindUsersArgs } from './args/find-users.args';
import { UpdateUserInput } from './dto/update-user.input';

@UseGuards(GqlAuthGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User, { description: "Creates a user using the current authenticated user details and a set of optional parameters to override." })
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
    @CurrentUser() user: AuthUser,
  ) {
    //TODO: Should allow only users to be created with this endpoint
    createUserInput = {
      ...createUserInput,
      ...user
    }
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() findUsersArgs: FindUsersArgs,
    @CurrentUser([ValidRoles.admin, ValidRoles.superAdmin]) user: User,
  ): Promise<User[]> {
    return this.usersService.findMany(findUsersArgs);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('uid', { type: () => String }) uid: string,
    @CurrentUser([]) user: User,
  ): Promise<User> {
    return Promise.resolve(user);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput._id, updateUserInput);
  }

  @Mutation(() => User)
  disableUser(
    @Args('uid', { type: () => String }) uid: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superAdmin]) user: User
  ) {
    if(user.uid === uid) throw new MethodNotAllowedException("A user can't disable itself");
    return this.usersService.updateState(uid, user, true);
  }

  @Mutation(() => User)
  enableUser(
    @Args('uid', { type: () => String }) uid: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superAdmin]) user: User
  ) {
    return this.usersService.updateState(uid, user, false);
  }

}
