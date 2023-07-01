export type TableColumn = {
  label: string;
  key: string;
  format: TableCellFormat;
  propConditionalClass?: { prop?: string; class?: any };
};
  
type TableCellFormat = 
| 'string'
| 'url'
| 'number'
| 'currency'
| 'boolean'
| 'date'
| 'dateAndTime'
| 'time';
