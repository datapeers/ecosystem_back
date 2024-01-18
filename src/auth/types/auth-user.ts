import { User } from '../../users/entities/user.entity';
import { IRol } from './rol';

/**
 * @ignore
 */
export interface AuthUser extends Partial<User> {
  rolDoc?: IRol;
}
