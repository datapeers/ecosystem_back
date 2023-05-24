import { ConfigToColumn, RowConfigColumn } from "../models/row-config-column";

const convertFormToColumns = (rowsForm: any[]): RowConfigColumn[] => {
  let displayColumnsTable: RowConfigColumn[] = [];
  if (rowsForm.length != 0) {
    const ignore = ["button", "htmlelement", "content"];
    const itemsForm = rowsForm.filter((i) => !ignore.includes(i.type));
    for (const iterator of itemsForm) {
      switch (iterator.type) {
        case "datagrid":
        for (const iteratorComponent of iterator) {
          const childGrid = set_row(`${iterator.label}, ${iteratorComponent.label}`, iterator.type, `item, ${iterator.key}; ${iteratorComponent.key}`, iteratorComponent);
          childGrid.type = "array";
          displayColumnsTable.push(childGrid);
        }
        break;
        case "panel":
        for (const iteratorComponent of iterator) {
          const childPanel = set_row(iteratorComponent.label, iteratorComponent.type, `item, ${iteratorComponent.key}`, iteratorComponent);
          displayColumnsTable.push(childPanel);
        }
        break;
        case "well":
        for (const iteratorComponent of iterator) {
          const childWell = set_row(iteratorComponent.label, iteratorComponent.type, `item, ${iteratorComponent.key}`, iteratorComponent);
          displayColumnsTable.push(childWell);
        }
        break;
        default:
        displayColumnsTable.push(set_row(iterator.label, iterator.type, `item, ${iterator.key}`, iterator));
        break;
      }
    }
  }
  return displayColumnsTable.map(ConfigToColumn);
}

export function set_row(label: string, format: string, key: any, row?: any) {
  switch (format) {
    case "textfield":
    if (row.widget && row.widget.type === "calendar") {
      return new RowConfigColumn(label, "data", key, "date");
    }
    return new RowConfigColumn(label, "data", key, "string");
    case "number":
    return new RowConfigColumn(label, "data", key, "number");
    case "currency":
    return new RowConfigColumn(label, "data", key, "currency");
    case "datetime":
    return new RowConfigColumn(label, "data", key, "dateAndTime");
    case "time":
    return new RowConfigColumn(label, "data", key, "time");
    case "checkbox":
    return new RowConfigColumn(label, "data", key, "boolean");
    case "tags":
    if (row.storeas) {
      return new RowConfigColumn(label, "data", key, "arraysTags");
    }
    return new RowConfigColumn(label, "data", key, "string");
    case "selectboxes":
    return new RowConfigColumn(label, "select_boxes", key, "string", {
      children: [],
      innerKeys: row.values.map((i) => {
        return { key: i.value, label: i.label };
      }),
    });
    case "select":
    let options;
    if (row?.data?.values) {
      options = row?.data?.values ? row.data.values.map((val) => val.value) : [];
    }
    if (row?.data?.json) {
      options = row?.data?.json ? row.data.json.map((val) => val?.value ?? val) : [];
    }
    let itemSelect = new RowConfigColumn(label, "data", key, "string", {
      options,
    });
    if (row.multiple) {
      if (row.data.url !== "" && row.valueProperty === "") {
        itemSelect = new RowConfigColumn(`${label}, ${row.label}`, "array", `${key}; value`, "string");
      } else {
        itemSelect = new RowConfigColumn(`${label}, ${row.label}`, "array", `${key};`, "string");
      }
    }
    return itemSelect;
    default:
    return new RowConfigColumn(label, "data", key, "string");
  }
}

export const tableUtilities = {
  convertFormToColumns
};
