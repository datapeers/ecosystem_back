import { registerEnumType } from "@nestjs/graphql";

export enum ApplicationStates {
  preregistered = "preregistered",
  enrolled = "enrolled",
  selected = "selected",
}

registerEnumType(ApplicationStates, {
  name: 'ApplicationStates',
});