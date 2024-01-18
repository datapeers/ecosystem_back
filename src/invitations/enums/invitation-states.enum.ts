import { registerEnumType } from '@nestjs/graphql';
/**
 * states of invitations
 */
export enum InvitationStates {
  enabled = 'enabled',
  disabled = 'disabled',
  accepted = 'accepted',
}

registerEnumType(InvitationStates, {
  name: 'InvitationStates',
});
