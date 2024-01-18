import { Body, Controller, Post } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  /**
   * accept invitation state
   */
  @Post('/accept')
  acceptInvitation(@Body() acceptInvitationDto: AcceptInvitationDto) {
    return this.invitationsService.accept(acceptInvitationDto);
  }
}
