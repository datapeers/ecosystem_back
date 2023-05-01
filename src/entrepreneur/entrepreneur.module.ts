import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntrepreneurService } from './entrepreneur.service';
import { EntrepreneurResolver } from './entrepreneur.resolver';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { Entrepreneur, EntrepreneurSchema } from './entities/entrepreneur.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Entrepreneur.name, schema: EntrepreneurSchema }]),
    AuthModule,
    UsersModule,
  ],
  providers: [EntrepreneurResolver, EntrepreneurService],
  exports: [EntrepreneurService],
})
export class EntrepreneurModule {}
