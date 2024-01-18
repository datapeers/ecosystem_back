import { registerEnumType } from '@nestjs/graphql';
/**
 * table column types
 */
export enum TableColumnType {
  data = 'data',
  array = 'array',
}
/**
 * @ignore
 */
registerEnumType(TableColumnType, {
  name: 'TableColumnType',
});
