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
  'challenger' = 'challenger',
}

export const rolNames: Record<ValidRoles, string> = {
  [ValidRoles.superAdmin]: 'Super admin',
  [ValidRoles.admin]: 'Admin',
  [ValidRoles.user]: 'Usuario',
  [ValidRoles.expert]: 'Experto',
  // [ValidRoles.investor]: "Inversionista",
  [ValidRoles.host]: 'Host',
  [ValidRoles.teamCoach]: 'Team Coach',
  [ValidRoles.challenger]: 'Challenger',
};

export const rolValues: Record<ValidRoles, number> = {
  [ValidRoles.superAdmin]: 9999,
  [ValidRoles.admin]: 999,
  [ValidRoles.host]: 99,
  [ValidRoles.teamCoach]: 9,
  [ValidRoles.expert]: 3,
  [ValidRoles.user]: 2,
  [ValidRoles.challenger]: 1,
};

registerEnumType(ValidRoles, {
  name: 'ValidRoles',
});
