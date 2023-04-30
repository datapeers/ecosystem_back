import { registerEnumType } from "@nestjs/graphql";

export enum FormCollections {
  announcements = "announcements",
  resources = "resources",
  survey = "survey",
  entrepreneurs = "entrepreneurs",
  startups = "startups",
  investors = "investors",
}

registerEnumType(FormCollections, {
  name: 'FormCollections',
});