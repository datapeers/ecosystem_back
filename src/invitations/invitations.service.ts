import { Injectable, InternalServerErrorException, MethodNotAllowedException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

@Injectable()
export class InvitationsService {
  constructor(
    @InjectModel(Invitation.name) private readonly invitationModel: Model<Invitation>,
    private readonly emailsService: EmailsService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(InvitationsService.name);
  }

  async create({ email, rol }: CreateInvitationArgs, adminUser: User) {
    const currentInvitation = await this.tryFindOneByEmail(email);
    // Limited to only one active invitation per email;
    if(currentInvitation) throw new MethodNotAllowedException(`There is already one invitation pending acceptance for the email ${email}`);

    const user = await this.usersService.tryFindOne({ email });
    if(user?.passwordSet) throw new MethodNotAllowedException("A user with this email already exists");
    
    const code = uuid.v4();
    if(!user) {
      // Create a new user
      this.authService.createAccountWithDefaultPassword(email, rol);
    } else {
      // Update the user role with the role from the new invitation
      if(!user.roles.includes(rol)) {
        await this.usersService.update({ _id: user._id }, { roles: [ rol ] });
      }
    }


    const invitationData = {
      email,
      rol,
      createdBy: adminUser.uid,
      code: code
    };
    try {
      const invitation = await this.invitationModel.create(invitationData);
      const emailTemplate: InvitationTemplate = new InvitationTemplate(); 
      emailTemplate.personalizations = [
        {
          to: [
            {
              email: invitation.email
            }
          ],
          dynamicTemplateData: {
            redirectUri: "http://localhost:4200/register",
            code: code,
            role: rolNames[invitation.rol]
          }
        }
      ];
      await this.emailsService.sendFromTemplate(emailTemplate);
      return invitation;
    } catch(ex) {
      this.logger.error(ex);
      throw new InternalServerErrorException("Failed to create invitation");
    }
  }

  findAll(skip: number = 0, limit: number = 25) {
    return this.invitationModel.find().skip(skip).limit(limit);
  }

  async findOne(filters: { _id?: string, code?: string, email?: string }) {
    const invitation = await this.invitationModel.findOne(filters);
    if(!invitation) throw new NotFoundException(`No invitation found with filters ${filters}`);
    return invitation;
  }

  async tryFindOneByEmail(email: string): Promise<Invitation> {
    const invitation = await this.invitationModel.findOne({ email: email, expiresAt: { $gte: new Date().toISOString() }, state: InvitationStates.enabled }).lean();
    return invitation;
  }

  async cancel(id: string) {
    const invitation = await this.findOne({ _id: id });
    if(invitation.state === InvitationStates.disabled) throw new MethodNotAllowedException("The invitation is already disabled");
    if(invitation.state === InvitationStates.accepted) throw new MethodNotAllowedException("Can't disable an accepted invitation");
    
    invitation.state = InvitationStates.disabled;
    await invitation.save();
    return invitation;
  }
  
  async accept({ code, name, password }: AcceptInvitationDto): Promise<Invitation> {
    // Validate invitation state
    const invitation = await this.findOne({ code });
    if(invitation.expired) throw new UnauthorizedException("The invitation has expired");
    if(invitation.state === InvitationStates.disabled) throw new UnauthorizedException("This invitation was disabled by an administrator");
    if(invitation.state === InvitationStates.accepted) throw new UnauthorizedException("This invitation was already accepted");
    
    // Update password
    const invitationUser = await this.usersService.tryFindOne({ email: invitation.email });
    if(!invitationUser || invitationUser?.passwordSet) throw new InternalServerErrorException("We were unable to complete the operation");
    await this.authService.updatePassword(invitationUser.uid, password);

    // Update Invitation and user states
    invitation.state = InvitationStates.accepted;
    await invitation.save(); 
    await this.usersService.update({ uid: invitationUser.uid, }, { passwordSet: new Date(), fullName: name });
    return invitation;
  }
}
