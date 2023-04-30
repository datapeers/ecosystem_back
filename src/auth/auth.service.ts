import * as admin from 'firebase-admin';
import * as serviceAccount from 'config/firebase/config.json';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthUser } from 'src/auth/types/auth-user';
import { AppLogger } from 'src/logger/app-logger';
import { ValidRoles } from './enums/valid-roles.enum';
@Injectable()
export class AuthService {
  private readonly defaultUserPassword: string =
    'oM4X74g11zhH4I7iorH8en91D9VlcTBI';

  constructor(
    private readonly usersService: UsersService,
    private readonly logger: AppLogger,
  ) {
    logger.setContext(AuthService.name);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

  async validateToken(idToken: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (ex) {
      this.logger.error(
        `Got an invalid or expired token ${idToken} with exception: ${ex}`,
      );
      throw new UnauthorizedException('Got an expired or invalid token');
    }
  }

  async exchangeToken(idToken: string): Promise<User | AuthUser> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const user = await this.usersService.tryFindOne({
        uid: decodedToken.uid,
      });
      if (user) return user;
      const userRecord = await admin.auth().getUser(decodedToken.uid);
      let authUser: AuthUser = {
        uid: userRecord.uid,
        fullName: userRecord.displayName,
        email: userRecord.email,
      };
      return authUser;
    } catch (error) {
      this.logger.error(
        `Error while verifying Firebase ID token: ${idToken}`,
        error,
      );
      throw new Error("Failed to authorize request");
    }
  }

  async createAccountWithDefaultPassword(email: string, rol: ValidRoles) {
    const user = await admin.auth().createUser({
      email: email,
      password: this.defaultUserPassword,
    });
    const createdUser = await this.usersService.create({
      uid: user.uid,
      fullName: '',
      email: email,
      roles: [rol],
      passwordSet: false,
    });
    return createdUser;
  }

  async updatePassword(uid: string, newPassword: string) {
    return await admin.auth().updateUser(uid, {
      password: newPassword,
    });
  }
}
