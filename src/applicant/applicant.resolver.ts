import { UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { ApplicantService } from './applicant.service';
import { Applicant } from './entities/applicant.entity';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { AnnouncementApplicantArgs } from './args/announcement-applicant.args';
import { UpdateApplicantStateInput } from './dto/update-applicant-state.input';
import { AnnouncementApplicantsArgs } from './args/announcement-applicants.args';
import GraphQLJSON from 'graphql-type-json';
import { ApplicantArgs } from './args/applicant.args';
import { SelectApplicantsArgs } from './args/select-applicants.args';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
/**
 * @ignore
 */
@Resolver(() => Applicant)
export class ApplicantResolver {
  constructor(private readonly applicantService: ApplicantService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Applicant], { name: 'applicants' })
  findMany(@Args() announcementApplicantsArgs: AnnouncementApplicantsArgs) {
    return this.applicantService.findMany(announcementApplicantsArgs);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Applicant, { name: 'applicant' })
  findOne(@Args() applicantArgs: ApplicantArgs) {
    return this.applicantService.findOneByState(applicantArgs);
  }

  @Query(() => Applicant, { name: 'announcementApplicant' })
  findAnnouncementApplicant(
    @Args() announcementApplicantArgs: AnnouncementApplicantArgs,
  ) {
    return this.applicantService.findByAnnouncement(announcementApplicantArgs);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UpdateResultPayload)
  deleteApplicants(@Args('ids', { type: () => [String] }) ids: [string]) {
    return this.applicantService.delete(ids);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Applicant)
  updateApplicantState(
    @Args('updateApplicantStateInput')
    updateApplicantStateInput: UpdateApplicantStateInput,
  ) {
    return this.applicantService.updateState(updateApplicantStateInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Applicant)
  selectApplicantState(
    @Args()
    selectApplicantsArgsInput: SelectApplicantsArgs,
    @CurrentUser() user: User,
  ) {
    return this.applicantService.selectedApplicant(
      selectApplicantsArgsInput,
      user,
    );
  }

  @ResolveField('documentsFields', () => GraphQLJSON)
  async getCreatedBy(@Parent() applicant: Applicant) {
    const files = applicant?.documents ?? [];
    return files.reduce((prev, curr) => {
      prev[curr.key] = curr.url;
      return prev;
    }, {});
  }
}
