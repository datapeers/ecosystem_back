import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvestorService } from './investor.service';
import { InvestorResolver } from './investor.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { Investor, InvestorSchema } from './entities/investor.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Investor.name, schema: InvestorSchema }]),
    AuthModule,
    UsersModule,
  ],
  providers: [InvestorResolver, InvestorService],
  exports: [InvestorService]
})
export class InvestorModule {}
