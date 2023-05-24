export interface IColumn {
  label: string;
  key: string;
  type: TableColumnType;
  format: TableCellFormat;
  position?: "start" | "end";
  options?: string[];
  booleanText?: { true: string; false: string };
  innerKeys?: { key: string; label: string }[];
  propConditionalClass?: { prop?: string; class?: any };
  children?: any[];
}

type TableCellFormat = "string" | "url" | "number" | "currency" | "boolean" | "date" | "dateAndTime" | "time";

type TableColumnType = "data" | "array";

export class RowConfigColumn {
  label: string;
  type: string;
  key: any;
  format: string;
  children?: RowConfigColumn[];
  innerKeys?: { key: string; label: string }[];
  options?: string[];
  propConditionalClass?: { prop?: string | undefined; class?: any } | null | undefined;
  booleanText?: { true: string; false: string } | null | undefined;
  constructor(
      label: string,
      type: string,
      key: any,
      format: string,
      extraOptions?: {
          children?: any[];
          innerKeys?: any;
          options?: string[];
          propConditionalClass?: { prop?: string; class?: any };
          booleanText?: { true: string; false: string };
      }
  ) {
      this.label = label;
      this.type = type;
      this.key = key;
      this.format = format;
      this.children = extraOptions?.children ?? [];
      this.innerKeys = extraOptions?.innerKeys ?? [];
      this.propConditionalClass = extraOptions?.propConditionalClass ?? null;
      this.booleanText = extraOptions?.booleanText ?? null;
      this.options = extraOptions?.options ?? undefined;
  }

  public static fromColumn(column: IColumn) {
      return new RowConfigColumn(column.label, column.type, column.key, column.format, {
          propConditionalClass: column.propConditionalClass,
          innerKeys: column.innerKeys,
          children: column.children,
          booleanText: column.booleanText,
      });
  }
}

export function ConfigToColumn(item: RowConfigColumn): IColumn {
  return {
      label: item.label,
      key: item.key,
      type: item.type as any,
      format: item.format as any,
      booleanText:
          item.format === "boolean"
              ? item.booleanText ?? {
                    true: "Si",
                    false: "No",
                }
              : undefined,
      innerKeys: item.innerKeys ?? undefined,
      propConditionalClass: item.propConditionalClass ?? undefined,
      options: item.options ?? undefined,
  };
}
