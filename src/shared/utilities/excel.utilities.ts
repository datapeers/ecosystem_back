import { Column, Workbook } from 'exceljs';
import * as moment from 'moment';
import { Types } from 'mongoose';
import { TableColumn } from '../models/table-column';
import { TableExportFormats } from '../models/table-export-formats.enum';

/**
 * @ignore
 */
const buildWorkbookBuffer = (
  columns: Partial<Column>[],
  rows,
  format: TableExportFormats = TableExportFormats.xlsx,
) => {
  const workbook = buildWorkbook(columns, rows);
  return getWorkbookBuffer(workbook, format);
};

/**
 * @ignore
 */
function buildWorkbook(columns: Partial<Column>[], rows: any[]) {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('data');
  worksheet.columns = columns;
  worksheet.addRows(rows);
  return workbook;
}

/**
 * @ignore
 */
async function getWorkbookBuffer(
  workbook: Workbook,
  format: TableExportFormats,
) {
  switch (format) {
    case TableExportFormats.csv:
      return workbook.csv.writeBuffer();
    case TableExportFormats.xlsx:
      return workbook.xlsx.writeBuffer();
    default:
      return workbook.xlsx.writeBuffer();
  }
}

/**
 * @ignore
 */
const dotNotate = (obj: any, target: any = {}, prefix: string = '') => {
  Object.keys(obj).map((key) => {
    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !(obj[key] instanceof Types.ObjectId)
    ) {
      dotNotate(obj[key], target, prefix + key + '.');
    } else {
      return (target[prefix + key] = obj[key]);
    }
  });
  return target;
};

/**
 * @ignore
 */
const createRow = (tableDocument: any, config: TableColumn[] = []) => {
  let newRow = { _id: tableDocument._id };
  const dotNotatedDocument = dotNotate(tableDocument);
  config.forEach((columnConfig) => {
    const { key } = columnConfig;
    const dotNotatedKey = key.split('; ').join('.').split(', ').join('.');
    const valuesPlaceholder = [];
    Object.entries(dotNotatedDocument).map(([k, v]) => {
      const fixedKey = k
        .split('.')
        .filter((kv) => isNaN(+kv))
        .join('.');
      if (fixedKey == dotNotatedKey) {
        valuesPlaceholder.push(v);
      }
    });
    newRow[key] = valuesPlaceholder;
  });
  return newRow;
};

/**
 * @ignore
 */
const applyCellFormat = (
  value: string | string[],
  args: TableColumn,
): string => {
  if (Array.isArray(value)) {
    return value.map((v) => formatCell(v, args)).join(', ');
  }
  return formatCell(value, args);
};

/**
 * @ignore
 */
const formatCell = (value: string, config: TableColumn) => {
  if (value === '' || value === null || value === undefined) {
    return '';
  }
  switch (config.format) {
    default:
      return value;
    case 'date':
      return moment(new Date(value)).format('yyyy-MM-dd');
    case 'dateAndTime':
      return moment(new Date(value)).format('DD-M-yy, h:mm a');
    case 'time':
      return moment(new Date(value)).format('h:mm a');
    case 'boolean':
      const booleanText = config.booleanText ?? { true: 'Si', false: 'No' };
      return value ? booleanText.true : booleanText.false;
  }
};

/**
 * @ignore
 */
const parseDocumentsToRows = (
  documents: any[],
  config: TableColumn[] = [],
): string[][] => {
  const rows = documents.map((doc) => createRow(doc, config));
  return rows.map((rowValue) =>
    config.map((columnConfig) =>
      applyCellFormat(rowValue[columnConfig.key], columnConfig),
    ),
  );
};

/**
 * @ignore
 */
function child_view(doc: any, key: string) {
  if (!key) {
    return doc;
  }
  if (!doc) {
    return 'error';
  }
  const props = key.split(',');
  if (props.length > 1) {
    return child_view(doc[props.shift().trim()], props.join());
  }
  const ans = doc[props.shift().trim()];
  return ans;
}

/**
 * @ignore
 */
function arrayView(value: Array<any>, prop: string) {
  if (!value) {
    return '';
  }
  if (!Array.isArray(value)) {
    return 'El valor no es un array';
  }
  const args = prop.trim();
  if (args === '') {
    return `${value.join(', ')}`;
  }
  return `${value
    .map((i) => {
      const item = child_view(i, args);
      if (Array.isArray(item)) {
        return `[ ${item.join(', ')} ]`;
      } else {
        return item;
      }
    })
    .join(', ')}`;
}

/**
 * functions necessary to build excel doc
 */
export const excelUtilities = {
  buildWorkbookBuffer,
  parseDocumentsToRows,
};
