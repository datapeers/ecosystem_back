import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
/**
 * main function to protect many request by user logged
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  /**
   * get user account by token in header
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();
    const user = await this.authService.exchangeToken(token);
    if (!user) throw new UnauthorizedException();
    const rol = await this.authService.getRol(user.rol);
    request.user = user;
    request.token = token;
    request.rol = rol;
    return request;
  }
  /**
   * extract token from header
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
