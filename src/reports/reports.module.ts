import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsResolver } from './reports.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './entities/report.entity';

@Module({
  providers: [ReportsResolver, ReportsService],
  imports: [
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
  ],
  exports: [ReportsService],
})
export class ReportsModule {}
