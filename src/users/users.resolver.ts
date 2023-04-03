import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { AuthUser } from '../auth/types/auth-user';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { FindUsersInput } from './inputs/find-users.input';
import { UpdateUserInput } from './dto/update-user.input';

@UseGuards(GqlAuthGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(
    @CurrentUser() user: AuthUser,
    @Args('createUserInput') createUserInput: CreateUserInput,
  ) {
    createUserInput = {
      ...createUserInput,
      ...user
    }
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args('findUsersInput') findUsersInput: FindUsersInput,
    @CurrentUser([ValidRoles.admin]) user: AuthUser,
  ): Promise<User[]> {
    return this.usersService.findMany(findUsersInput);
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('uid', { type: () => String }) uid: string): Promise<User> {
    return this.usersService.findOne(uid);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput._id, updateUserInput);
  }

}
