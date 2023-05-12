import { registerEnumType } from "@nestjs/graphql";

export enum AnnouncementTypes {
  challenge = "challenge",
  open = "open",
}

registerEnumType(AnnouncementTypes, {
  name: 'AnnouncementTypes',
});