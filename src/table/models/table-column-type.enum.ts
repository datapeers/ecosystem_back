import { registerEnumType } from "@nestjs/graphql";

export enum TableColumnType {
  data = "data",
  array = "array",
};

registerEnumType(TableColumnType, {
  name: 'TableColumnType',
});
