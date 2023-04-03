import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthGuard } from './guards/jwt-auth.guard';
import { GqlAuthGuard } from './guards/jwt-gql-auth.guard';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [AuthController],
  providers: [AuthService,
    // {
    //   provide: "APP_GUARD",
    //   useClass: AuthGuard,
    // },
    // {
    //   provide: "GQL_APP_GUARD",
    //   useClass: GqlAuthGuard,
    // },
  ],
  exports: [AuthService],
})
export class AuthModule {}
