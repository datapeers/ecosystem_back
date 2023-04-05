import * as admin from 'firebase-admin';
import * as serviceAccount from 'config/firebase/config.json';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthUser } from 'src/auth/types/auth-user';
@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

  async validateUser(idToken: string): Promise<User> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const user = await this.usersService.findOne(decodedToken.uid);
      return user;
    } catch (error) {
      console.error('Error while verifying Firebase ID token:', error);
      throw error;
    }
  }

  async exchangeToken(idToken: string): Promise<AuthUser> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userRecord = await admin.auth().getUser(decodedToken.uid);
      let authUser: AuthUser = {
        uid: userRecord.uid,
        fullName: userRecord.displayName,
        email: userRecord.email,
      };
      return authUser;
    } catch (error) {
      console.error('Error while verifying Firebase ID token:', error);
      throw error;
    }
  }
}
