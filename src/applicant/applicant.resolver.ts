import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { ApplicantService } from './applicant.service';
import { Applicant } from './entities/applicant.entity';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { AnnouncementApplicantArgs } from './args/announcement-applicant.args';

@Resolver(() => Applicant)
export class ApplicantResolver {
  constructor(private readonly applicantService: ApplicantService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Applicant], { name: 'applicants' })
  findMany(@Args('announcement') announcement: string) {
    return this.applicantService.findMany(announcement);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Applicant, { name: 'applicant' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.applicantService.findOne(id);
  }
  
  @Query(() => Applicant, { name: 'announcementApplicant' })
  findAnnouncementApplicant(@Args() announcementApplicantArgs: AnnouncementApplicantArgs) {
    return this.applicantService.findByAnnouncement(announcementApplicantArgs);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UpdateResultPayload)
  deleteApplicants(@Args('ids', { type: () => [String] }) ids: [string]) {
    return this.applicantService.delete(ids);
  }
}
