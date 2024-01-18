import { User } from '../../users/entities/user.entity';

/**
 * @ignore
 */
export class AuthResponse {
  token: string;

  user: User;
}
