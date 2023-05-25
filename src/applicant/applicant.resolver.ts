import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { ApplicantService } from './applicant.service';
import { Applicant } from './entities/applicant.entity';
import { UpdateResultPayload } from 'src/shared/models/update-result';

@UseGuards(GqlAuthGuard)
@Resolver(() => Applicant)
export class ApplicantResolver {
  constructor(private readonly applicantService: ApplicantService) {}

  @Query(() => [Applicant], { name: 'applicants' })
  findAll() {
    return this.applicantService.findAll();
  }

  @Query(() => Applicant, { name: 'applicant' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.applicantService.findOne(id);
  }

  @Mutation(() => UpdateResultPayload)
  deleteApplicants(@Args('ids', { type: () => [String] }) ids: [string]) {
    return this.applicantService.delete(ids);
  }
}
