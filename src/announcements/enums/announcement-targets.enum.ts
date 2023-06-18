import { registerEnumType } from "@nestjs/graphql";

export enum AnnouncementTargets {
  entrepreneurs = "entrepreneurs",
  experts = "experts",
}

registerEnumType(AnnouncementTargets, {
  name: 'AnnouncementTargets',
});