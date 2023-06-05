import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessResolver } from './business.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { Business, BusinessSchema } from './entities/business.entity';
import { EntrepreneurModule } from 'src/entrepreneur/entrepreneur.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Business.name, schema: BusinessSchema }]),
    AuthModule,
    UsersModule,
    EntrepreneurModule,
  ],
  providers: [BusinessResolver, BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}
