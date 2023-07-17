import { Module, forwardRef } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessResolver } from './business.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { Business, BusinessSchema } from './entities/business.entity';
import { EntrepreneurModule } from 'src/entrepreneur/entrepreneur.module';
import { DownloadsModule } from 'src/downloads/downloads.module';
import { TableModule } from 'src/table/table.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Business.name, schema: BusinessSchema }]),
    AuthModule,
    UsersModule,
    forwardRef(() => EntrepreneurModule),
    DownloadsModule,
    forwardRef(() => TableModule),
  ],
  providers: [BusinessResolver, BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}
