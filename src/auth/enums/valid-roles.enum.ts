import { registerEnumType } from '@nestjs/graphql';

/**
 * roles in app
 */
export enum ValidRoles {
  superAdmin = 'superAdmin',
  admin = 'admin',
  expert = 'expert',
  user = 'user',
  host = 'host',
  teamCoach = 'teamCoach',
  challenger = 'challenger',
}
/**
 * roles names
 */
export const rolNames: Record<ValidRoles, string> = {
  [ValidRoles.superAdmin]: 'Super admin',
  [ValidRoles.admin]: 'Admin',
  [ValidRoles.user]: 'Usuario',
  [ValidRoles.expert]: 'Experto',
  [ValidRoles.host]: 'Host',
  [ValidRoles.teamCoach]: 'Team Coach',
  [ValidRoles.challenger]: 'Challenger',
};

/**
 * roles weight
 */
export const rolValues: Record<ValidRoles, number> = {
  [ValidRoles.superAdmin]: 9999,
  [ValidRoles.admin]: 999,
  [ValidRoles.host]: 99,
  [ValidRoles.teamCoach]: 9,
  [ValidRoles.expert]: 3,
  [ValidRoles.user]: 2,
  [ValidRoles.challenger]: 1,
};
/**
 * @ignore
 */
registerEnumType(ValidRoles, {
  name: 'ValidRoles',
});
