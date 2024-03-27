import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ReportsService } from './reports.service';
import { Report } from './entities/report.entity';
import { CreateReportInput } from './dto/create-report.input';
import { UpdateReportInput } from './dto/update-report.input';

@Resolver(() => Report)
export class ReportsResolver {
  constructor(private readonly reportsService: ReportsService) {}

  @Mutation(() => Report)
  createReport(
    @Args('createReportInput') createReportInput: CreateReportInput,
  ) {
    return this.reportsService.create(createReportInput);
  }

  @Query(() => [Report], { name: 'reports' })
  findAll() {
    return this.reportsService.findAll();
  }

  @Query(() => Report, { name: 'report' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.reportsService.findOne(id);
  }
}
