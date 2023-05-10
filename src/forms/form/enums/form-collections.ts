import { registerEnumType } from "@nestjs/graphql";

export enum FormCollections {
  announcements = "announcements",
  resources = "resources",
  survey = "survey",
  entrepreneurs = "entrepreneurs",
  startups = "startups",
  investors = "investors",
  responsibles = "responsibles"
}

registerEnumType(FormCollections, {
  name: 'FormCollections',
});