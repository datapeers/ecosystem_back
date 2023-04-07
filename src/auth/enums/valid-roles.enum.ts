import { registerEnumType } from "@nestjs/graphql";

// TODO: Implementar enum como GraphQL Enum Type
export enum ValidRoles {
  superAdmin = 'superAdmin',
  admin = 'admin',
  investor = 'investor',
  responsible = 'responsible',
  user = 'user',
}

export const rolValues: Record<ValidRoles, number> = {
  [ValidRoles.superAdmin]: 99999,
  [ValidRoles.admin]: 9999,
  [ValidRoles.investor]: 4,
  [ValidRoles.responsible]: 3,
  [ValidRoles.user]: 2,
}

registerEnumType(ValidRoles, {
  name: 'ValidRoles',
});