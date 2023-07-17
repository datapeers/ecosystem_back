import { registerEnumType } from "@nestjs/graphql";

export enum TableExportFormats {
  csv = "csv",
  xlsx = "xlsx"
}

registerEnumType(TableExportFormats, {
  name: 'TableExportFormats',
});