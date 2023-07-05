import { registerEnumType } from '@nestjs/graphql';

// TODO: Implementar enum como GraphQL Enum Type
export enum ValidRoles {
  superAdmin = 'superAdmin',
  admin = 'admin',
  expert = 'expert',
  user = 'user',
  // investor = 'investor',
  host = 'host',
  teamCoach = 'teamCoach',
}

export const rolNames: Record<ValidRoles, string> = {
  [ValidRoles.superAdmin]: 'Super admin',
  [ValidRoles.admin]: 'Admin',
  [ValidRoles.user]: 'Usuario',
  [ValidRoles.expert]: 'Experto',
  // [ValidRoles.investor]: "Inversionista",
  [ValidRoles.host]: 'Host',
  [ValidRoles.teamCoach]: 'Team Coach',
};

export const rolValues: Record<ValidRoles, number> = {
  [ValidRoles.superAdmin]: 99999,
  [ValidRoles.admin]: 9999,
  [ValidRoles.expert]: 3,
  [ValidRoles.user]: 2,
  // [ValidRoles.investor]: 4,
  [ValidRoles.host]: 9999,
  [ValidRoles.teamCoach]: 9999,
};

registerEnumType(ValidRoles, {
  name: 'ValidRoles',
});
