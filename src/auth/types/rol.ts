import { Permission } from '../enums/permissions.enum';

/**
 * @ignore
 */
export interface IRol {
  _id?: string;
  name: string;
  type: string;
  permissions: Permission[];
}
