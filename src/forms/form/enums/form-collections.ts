import { registerEnumType } from "@nestjs/graphql";

export enum FormCollections {
  Announcements = "announcements",
  Entrepreneurs = "entrepreneurs",
  Resources = "resources",
  Survey = "survey"
}

registerEnumType(FormCollections, {
  name: 'FormCollections',
});