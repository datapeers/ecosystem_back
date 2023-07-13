import { User } from '../../users/entities/user.entity';

export interface AuthUser extends Partial<User> {
  rolDoc?: any;
}
