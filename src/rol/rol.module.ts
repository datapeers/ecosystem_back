import { Module } from '@nestjs/common';
import { RolService } from './rol.service';
import { RolResolver } from './rol.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Rol, RolSchema } from './entities/rol.entity';
import { RolInitializer } from './rol.initializer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rol.name, schema: RolSchema }]),
    AuthModule,
  ],
  providers: [RolResolver, RolService, RolInitializer],
  exports: [RolService],
})
export class RolModule {}
