import { registerEnumType } from '@nestjs/graphql';
/**
 * @ignore
 */
export enum LogicOperator {
  and = 'and',
  or = 'or',
}
/**
 * @ignore
 */
registerEnumType(LogicOperator, {
  name: 'LogicOperator',
});
