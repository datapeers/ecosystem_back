import { ConfigToColumn, RowConfigColumn } from '../models/row-config-column';
import { TableColumnType } from '../models/table-column-type.enum';

const convertFormToColumns = (
  rowsForm: any[],
  files: any[],
  prefix: string = ""
): RowConfigColumn[] => {
  let displayColumnsTable: RowConfigColumn[] = [];
  if (rowsForm.length != 0) {
    const ignore = ['button', 'htmlelement', 'content'];
    const itemsForm = rowsForm.filter((i) => !ignore.includes(i.type));
    for (const iterator of itemsForm) {
      switch (iterator.type) {
        case 'datagrid':
          for (const iteratorComponent of iterator) {
            let key = `item, ${iterator.key}; ${iteratorComponent.key}`;
            if(prefix)
              key = [prefix, key].join("; ");
            const childGrid = set_row(
              `${iterator.label}, ${iteratorComponent.label}`,
              iterator.type,
              key,
              iteratorComponent,
            );
            childGrid.type = TableColumnType.array;
            displayColumnsTable.push(childGrid);
          }
          break;
        case 'panel':
          for (const iteratorComponent of iterator) {
            let key = `item, ${iteratorComponent.key}`;
            if(prefix)
              key = [prefix, key].join("; ");
            const childPanel = set_row(
              iteratorComponent.label,
              iteratorComponent.type,
              key,
              iteratorComponent,
            );
            displayColumnsTable.push(childPanel);
          }
          break;
        case 'well':
          for (const iteratorComponent of iterator) {
            let key = `item, ${iteratorComponent.key}`;
            if(prefix)
              key = [prefix, key].join("; ");
            const childWell = set_row(
              iteratorComponent.label,
              iteratorComponent.type,
              key,
              iteratorComponent,
            );
            displayColumnsTable.push(childWell);
          }
          break;
        default:
          let key = `item, ${iterator.key}`;
          if(prefix)
            key = [prefix, key].join("; ");
          displayColumnsTable.push(
            set_row(
              iterator.label,
              iterator.type,
              key,
              iterator,
            ),
          );
          break;
      }
    }
  }
  if (files?.length) {
    for (const fileField of files) {
      displayColumnsTable.push(
        new RowConfigColumn(
          fileField.name,
          TableColumnType.data,
          `documentsFields, ${fileField.key}`,
          'url',
        ),
      );
    }
  }
  return displayColumnsTable.map(ConfigToColumn);
};

export function set_row(label: string, format: string, key: any, row?: any) {
  switch (format) {
    case 'textfield':
      if (row.widget && row.widget.type === 'calendar') {
        return new RowConfigColumn(label, TableColumnType.data, key, 'date');
      }
      return new RowConfigColumn(label, TableColumnType.data, key, 'string');
    case 'number':
      return new RowConfigColumn(label, TableColumnType.data, key, 'number');
    case 'currency':
      return new RowConfigColumn(label, TableColumnType.data, key, 'currency');
    case 'datetime':
      return new RowConfigColumn(label, TableColumnType.data, key, 'dateAndTime');
    case 'time':
      return new RowConfigColumn(label, TableColumnType.data, key, 'time');
    case 'checkbox':
      return new RowConfigColumn(label, TableColumnType.data, key, 'boolean');
    case 'tags':
      if (row.storeas) {
        return new RowConfigColumn(label, TableColumnType.data, key, 'arraysTags');
      }
      return new RowConfigColumn(label, TableColumnType.data, key, 'string');
    case 'selectboxes':
      return new RowConfigColumn(label, TableColumnType.array, key, 'string', {
        children: [],
        innerKeys: row.values.map((i) => {
          return { key: i.value, label: i.label };
        }),
      });
    case 'select':
      let options;
      if (row?.data?.values) {
        options = row?.data?.values
          ? row.data.values.map((val) => val.value)
          : [];
      }
      if (row?.data?.json) {
        options = row?.data?.json
          ? row.data.json.map((val) => val?.value ?? val)
          : [];
      }
      let itemSelect = new RowConfigColumn(label, TableColumnType.data, key, 'string', {
        options,
      });
      if (row.multiple) {
        if (row.data.url !== '' && row.valueProperty === '') {
          itemSelect = new RowConfigColumn(
            `${label}, ${row.label}`,
            TableColumnType.array,
            `${key}; value`,
            'string',
          );
        } else {
          itemSelect = new RowConfigColumn(
            `${label}, ${row.label}`,
            TableColumnType.array,
            `${key};`,
            'string',
          );
        }
      }
      return itemSelect;
    default:
      return new RowConfigColumn(label, TableColumnType.data, key, 'string');
  }
}

export function columnStartupsExpert() {
  return new RowConfigColumn(
    'Startups Asignadas',
    TableColumnType.array,
    'phases; startUps, name',
    'string',
  );
}

export function columnsCommunities() {
  return [
    new RowConfigColumn(
      'Líder',
      TableColumnType.array,
      'entrepreneurs; item, nombre',
      'string',
    ),
    new RowConfigColumn(
      'Contacto',
      TableColumnType.array,
      'entrepreneurs; item, telefono',
      'string',
    ),
  ];
}

export const tableUtilities = {
  convertFormToColumns,
  columnStartupsExpert,
  columnsCommunities,
};
