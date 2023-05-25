import { registerEnumType } from "@nestjs/graphql";

// TODO: Implementar enum como GraphQL Enum Type
export enum ValidRoles {
  superAdmin = 'superAdmin',
  admin = 'admin',
  investor = 'investor',
  expert = 'expert',
  user = 'user',
}

export const rolNames: Record<ValidRoles, string> = {
  [ValidRoles.superAdmin]: "Super admin",
  [ValidRoles.admin]: "Admin",
  [ValidRoles.user]: "Usuario",
  [ValidRoles.expert]: "Experto",
  [ValidRoles.investor]: "Inversionista"
}

export const rolValues: Record<ValidRoles, number> = {
  [ValidRoles.superAdmin]: 99999,
  [ValidRoles.admin]: 9999,
  [ValidRoles.investor]: 4,
  [ValidRoles.expert]: 3,
  [ValidRoles.user]: 2,
}

registerEnumType(ValidRoles, {
  name: 'ValidRoles',
});