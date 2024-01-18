import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvestorService } from './investor.service';
import { InvestorResolver } from './investor.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { Investor, InvestorSchema } from './entities/investor.entity';
import { DownloadsModule } from 'src/downloads/downloads.module';
import { TableModule } from 'src/table/table.module';
/**
 * @ignore
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Investor.name, schema: InvestorSchema },
    ]),
    AuthModule,
    UsersModule,
    DownloadsModule,
    forwardRef(() => TableModule),
  ],
  providers: [InvestorResolver, InvestorService],
  exports: [InvestorService],
})
export class InvestorModule {}
