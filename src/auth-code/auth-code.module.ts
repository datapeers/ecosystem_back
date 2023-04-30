import { Module } from '@nestjs/common';
import { AuthCodeService } from './auth-code.service';
import { AuthCodeResolver } from './auth-code.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthCode, AuthCodeSchema } from './entities/auth-code.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: AuthCode.name, schema: AuthCodeSchema }])
  ],
  providers: [AuthCodeResolver, AuthCodeService]
})
export class AuthCodeModule {}
