import { registerEnumType } from "@nestjs/graphql";

export enum MatchMode {
  contains = 'contains',
  notContains = 'notContains',
  startsWith = 'startsWith',
  endsWith = 'endsWith',
  equals = 'equals',
  notEquals = 'notEquals',
}

registerEnumType(MatchMode, {
  name: 'MatchMode',
});