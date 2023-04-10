import { registerEnumType } from "@nestjs/graphql";

export enum InvitationStates {
  enabled = "enabled",
  disabled = "disabled",
  accepted = "accepted"
}

registerEnumType(InvitationStates, {
  name: 'InvitationStates',
});