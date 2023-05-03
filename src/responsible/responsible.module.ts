import { Module } from '@nestjs/common';
import { ResponsibleService } from './responsible.service';
import { ResponsibleResolver } from './responsible.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { Responsible, ResponsibleSchema } from './entities/responsible.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Responsible.name, schema: ResponsibleSchema }]),
    AuthModule,
    UsersModule,
  ],
  providers: [ResponsibleResolver, ResponsibleService],
  exports: [ResponsibleService]
})
export class ResponsibleModule {}
