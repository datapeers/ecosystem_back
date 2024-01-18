import { registerEnumType } from '@nestjs/graphql';
/**
 * @ignore
 */
export enum MatchMode {
  contains = 'contains',
  notContains = 'notContains',
  startsWith = 'startsWith',
  endsWith = 'endsWith',
  equals = 'equals',
  notEquals = 'notEquals',
}
/**
 * @ignore
 */
registerEnumType(MatchMode, {
  name: 'MatchMode',
});
