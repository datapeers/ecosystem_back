import { User } from '../../users/entities/user.entity';
import { IRol } from './rol';

export interface AuthUser extends Partial<User> {
  rolDoc?: IRol;
}
