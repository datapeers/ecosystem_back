import { Permission } from '../enums/permissions.enum';

export interface IRol {
  _id?: string;
  name: string;
  type: string;
  permissions: Permission[];
}
