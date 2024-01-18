import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { InvitationsService } from './invitations.service';
import { Invitation } from './entities/invitation.entity';
import { CreateInvitationArgs } from './args/create-invitation.args';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';
import { FindInvitationArgs } from './args/find-invitation.args';
import { UsersService } from 'src/users/users.service';
/**
 * @ignore
 */
@UseGuards(GqlAuthGuard)
@Resolver(() => Invitation)
export class InvitationsResolver {
  constructor(
    private readonly invitationsService: InvitationsService,
    private readonly usersService: UsersService,
  ) {}

  @Query(() => [Invitation], { name: 'invitations' })
  findAll(
    @Args() findInvitationArgs: FindInvitationArgs,
    @CurrentUser([ValidRoles.admin, ValidRoles.superAdmin]) user: User,
  ) {
    return this.invitationsService.findAll(
      findInvitationArgs.skip,
      findInvitationArgs.limit,
    );
  }

  @Mutation(() => Invitation)
  createInvitation(
    @Args() createInvitationArgs: CreateInvitationArgs,
    @CurrentUser([ValidRoles.admin, ValidRoles.superAdmin]) user: User,
  ) {
    return this.invitationsService.create(createInvitationArgs, user);
  }

  @Mutation(() => Invitation)
  resendInvitation(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superAdmin]) user: User,
  ) {
    return this.invitationsService.resend(id);
  }

  @Mutation(() => Invitation)
  cancelInvitation(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superAdmin]) user: User,
  ) {
    return this.invitationsService.cancel(id);
  }

  @ResolveField('createdBy', () => User)
  async getInvitationCreator(@Parent() invitation: Invitation) {
    const { createdBy: uid } = invitation;
    return await this.usersService.findOne(uid);
  }
}
