import { registerEnumType } from '@nestjs/graphql';
/**
 * @ignore
 */
export enum TableExportFormats {
  csv = 'csv',
  xlsx = 'xlsx',
}
/**
 * @ignore
 */
registerEnumType(TableExportFormats, {
  name: 'TableExportFormats',
});
