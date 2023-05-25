import { Module } from '@nestjs/common';
import { ExpertService } from './expert.service';
import { ExpertResolver } from './expert.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { Expert, ExpertSchema } from './entities/expert.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Expert.name, schema: ExpertSchema }]),
    AuthModule,
    UsersModule,
  ],
  providers: [ExpertResolver, ExpertService],
  exports: [ExpertService]
})
export class ExpertModule {}
