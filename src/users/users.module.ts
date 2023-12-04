import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { RolModule } from 'src/rol/rol.module';
import { UserLogModule } from 'src/user-log/user-log.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UserLogModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RolModule,
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
