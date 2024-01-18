import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AuthCodeService } from './auth-code.service';
import { AuthCode } from './entities/auth-code.entity';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from 'src/auth/types/auth-user';
import { BearerToken } from 'src/auth/decorators/bearer-token.decorator';
/**
 * @ignore
 */
@Resolver(() => AuthCode)
export class AuthCodeResolver {
  constructor(private readonly authCodeService: AuthCodeService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => AuthCode)
  createAuthCode(@CurrentUser() user: AuthUser, @BearerToken() jwt: string) {
    return this.authCodeService.create(user, jwt);
  }

  @Query(() => AuthCode, { name: 'authCode' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.authCodeService.findOne(id);
  }
}
