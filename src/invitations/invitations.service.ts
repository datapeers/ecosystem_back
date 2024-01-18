import {
  Injectable,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as uuid from 'uuid';
import { AppLogger } from 'src/logger/app-logger';
import { CreateInvitationArgs } from './args/create-invitation.args';
import { Invitation } from './entities/invitation.entity';
import { InvitationStates } from './enums/invitation-states.enum';
import { EmailsService } from 'src/emails/emails.service';
import { User } from 'src/users/entities/user.entity';
import { InvitationTemplate } from 'src/emails/templates/invitation';
import { rolNames } from 'src/auth/enums/valid-roles.enum';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { AppConfiguration } from 'config/app.config';
import { ConfigService } from '@nestjs/config';
import { AuthUser } from 'src/auth/types/auth-user';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectModel(Invitation.name)
    private readonly invitationModel: Model<Invitation>,
    private readonly emailsService: EmailsService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly logger: AppLogger,
    private readonly configService: ConfigService<AppConfiguration>,
  ) {
    this.logger.setContext(InvitationsService.name);
  }

  /**
   * create an invitation
   */
  async create(
    { email, rol }: CreateInvitationArgs,
    adminUser: User,
    metadata?,
  ) {
    const currentInvitation = await this.tryFindOneByEmail(email);
    // Limited to only one active invitation per email;
    if (currentInvitation)
      throw new MethodNotAllowedException(
        `There is already one invitation pending acceptance for the email ${email}`,
      );

    let user = await this.usersService.tryFindOne({ email });
    // if (user?.passwordSet)
    //   throw new MethodNotAllowedException(
    //     'A user with this email already exists',
    //   );

    const code = uuid.v4();
    if (!user) {
      // Create a new user
      user = await this.authService.createAccountWithDefaultPassword(
        email,
        rol,
      );
    } else {
      // Update the user role with the role from the new invitation
      const rolDoc = await this.usersService.findRolByType(rol);
      if (user.rol.toString() !== rolDoc._id.toString()) {
        await this.usersService.update({ _id: user._id }, { rol: rolDoc._id });
      }
    }
    const invitationData = {
      email,
      rol,
      createdBy: adminUser.uid,
      code: code,
      metadata: {
        ...metadata,
        uidAccount: user.uid,
      },
    };
    try {
      const invitation = await this.invitationModel.create(invitationData);
      const emailTemplate: InvitationTemplate = new InvitationTemplate();
      emailTemplate.personalizations = [
        {
          to: [
            {
              email: invitation.email,
            },
          ],
          dynamicTemplateData: {
            redirectUri: `${this.configService.get('appUri')}/register`,
            code: code,
            role: rolNames[invitation.rol],
          },
        },
      ];
      await this.emailsService.sendFromTemplate(emailTemplate);
      return invitation;
    } catch (ex) {
      this.logger.error(ex);
      // console.log(ex);
      throw new InternalServerErrorException('Failed to create invitation');
    }
  }

  /**
   * find all invitation
   */
  findAll(skip: number = 0, limit: number = 25) {
    return this.invitationModel.find().skip(skip).limit(limit);
  }

  /**
   * find invitation by filters
   */
  async findOne(filters: { _id?: string; code?: string; email?: string }) {
    const invitation = await this.invitationModel.findOne(filters).lean();
    if (!invitation)
      throw new NotFoundException(
        `No invitation found with filters ${filters}`,
      );
    return invitation;
  }

  /**
   * find an invitation by email
   */
  async tryFindOneByEmail(email: string): Promise<Invitation> {
    const invitation = await this.invitationModel
      .findOne({
        email: email,
        expiresAt: { $gte: new Date().toISOString() },
        state: InvitationStates.enabled,
      })
      .lean();
    return invitation;
  }

  /**
   * resend an invitation
   */
  async resend(id: string) {
    const invitation = await this.findOne({ _id: id });
    if (invitation.state !== InvitationStates.enabled)
      throw new MethodNotAllowedException(`Invitation ${invitation.state}`);
    const emailTemplate: InvitationTemplate = new InvitationTemplate();
    emailTemplate.personalizations = [
      {
        to: [
          {
            email: invitation.email,
          },
        ],
        dynamicTemplateData: {
          redirectUri: `${this.configService.get('appUri')}/register`,
          code: invitation.code,
          role: rolNames[invitation.rol],
        },
      },
    ];
    await this.emailsService.sendFromTemplate(emailTemplate);
    return invitation;
  }

  /**
   * cancel an invitation
   */
  async cancel(id: string) {
    const invitation = await this.invitationModel.findOne({ _id: id });
    if (invitation.state === InvitationStates.disabled)
      throw new MethodNotAllowedException('The invitation is already disabled');
    if (invitation.state === InvitationStates.accepted)
      throw new MethodNotAllowedException(
        "Can't disable an accepted invitation",
      );

    invitation.state = InvitationStates.disabled;
    await invitation.save();
    // await this.authService.deleteUser();
    return invitation;
  }

  /**
   * invitation accepted
   */
  async accept({
    code,
    name,
    password,
  }: AcceptInvitationDto): Promise<Invitation> {
    // Validate invitation state
    const invitation = await this.invitationModel.findOne({ code });
    if (invitation.expired)
      throw new UnauthorizedException('The invitation has expired');
    if (invitation.state === InvitationStates.disabled)
      throw new UnauthorizedException(
        'This invitation was disabled by an administrator',
      );
    if (invitation.state === InvitationStates.accepted)
      throw new UnauthorizedException('This invitation was already accepted');

    const userDoc = await this.usersService.tryFindOne({
      email: invitation.email,
    });
    if (!userDoc) {
      throw new InternalServerErrorException(
        'We were unable to complete the operation',
      );
    }
    if (password === 'googleInMethod') {
      await this.usersService.update({ uid: userDoc.uid }, { googleIn: true });
    } else {
      // Update password
      await this.authService.updatePassword(userDoc.uid, password);
    }
    // Update Invitation and user states
    invitation.state = InvitationStates.accepted;
    await invitation.save();
    await this.usersService.update(
      { uid: userDoc.uid },
      { passwordSet: new Date(), fullName: name },
    );
    return invitation;
  }
}
