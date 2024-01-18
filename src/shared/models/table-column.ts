import { TableColumnType } from 'src/table/models/table-column-type.enum';
/**
 * @ignore
 */
export type TableColumn = {
  label: string;
  key: string;
  type: TableColumnType;
  format: TableCellFormat;
  propConditionalClass?: { prop?: string; class?: any };
  booleanText?: { true: string; false: string };
};
/**
 * @ignore
 */
export type TableCellFormat =
  | 'string'
  | 'url'
  | 'number'
  | 'currency'
  | 'boolean'
  | 'date'
  | 'dateAndTime'
  | 'time'
  | 'arraysTags';
