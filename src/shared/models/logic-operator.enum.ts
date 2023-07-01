import { registerEnumType } from "@nestjs/graphql";

export enum LogicOperator {
  and = "and",
  or = "or",
}

registerEnumType(LogicOperator, {
  name: 'LogicOperator',
});