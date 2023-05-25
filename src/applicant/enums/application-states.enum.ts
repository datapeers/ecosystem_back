import { registerEnumType } from "@nestjs/graphql";

export enum ApplicationStates {
  preselected = "preselected",
  selected = "selected",
}

registerEnumType(ApplicationStates, {
  name: 'ApplicationStates',
});