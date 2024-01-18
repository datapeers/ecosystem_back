import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/jwt-gql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from '../auth/types/auth-user';
import { AnnouncementsService } from './announcements.service';
import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementInput } from './dto/create-announcement.input';
import { UpdateAnnouncementInput } from './dto/update-announcement.input';
import { UsersService } from '../users/users.service';
import { Form } from 'src/forms/form/entities/form.entity';
import { FormsService } from '../forms/form/forms.service';
import { ApplicantService } from 'src/applicant/applicant.service';
import { SubmitAnnouncementDocInput } from './dto/submit-announcement-doc.input';
import { FormSubmission } from 'src/forms/form/entities/form-submission';
/**
 * @ignore
 */
@Resolver(() => Announcement)
export class AnnouncementsResolver {
  constructor(
    private readonly announcementsService: AnnouncementsService,
    private readonly usersService: UsersService,
    private readonly formsService: FormsService,
    private readonly applicantService: ApplicantService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Announcement], { name: 'announcements' })
  findAll() {
    return this.announcementsService.findAll();
  }

  @Query(() => Announcement, { name: 'announcement' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.announcementsService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Announcement)
  createAnnouncement(
    @Args('createAnnouncementInput')
    createAnnouncementInput: CreateAnnouncementInput,
    @CurrentUser() user: AuthUser,
  ) {
    const AnnouncementInput = {
      ...createAnnouncementInput,
      createBy: user,
    };
    return this.announcementsService.create(AnnouncementInput, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Announcement)
  updateAnnouncement(
    @Args('updateAnnouncementInput')
    updateAnnouncementInput: UpdateAnnouncementInput,
    @CurrentUser() user: AuthUser,
  ) {
    const { _id, ...updatedFields } = updateAnnouncementInput;
    return this.announcementsService.update(_id, updatedFields, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Announcement)
  publishAnnouncement(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.announcementsService.publish(id, user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Announcement)
  unpublishAnnouncement(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.announcementsService.unpublish(id, user);
  }

  @Mutation(() => FormSubmission)
  async submitAnnouncementDoc(
    @Args('submitAnnouncementDocInput')
    submitAnnouncementDocInput: SubmitAnnouncementDocInput,
  ) {
    const document = await this.applicantService.handleDocumentSubmit(
      submitAnnouncementDocInput,
    );
    return { _id: document._id, submission: document.item };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Announcement)
  removeAnnouncement(@Args('id', { type: () => String }) id: string) {
    return this.announcementsService.remove(id);
  }

  @ResolveField('createdBy', () => String)
  async getCreatedBy(@Parent() announcement: Announcement) {
    const user = await this.usersService.findOne(announcement.createdBy);
    return user.fullName;
  }

  @ResolveField('updatedBy', () => String)
  async getUpdatedBy(@Parent() announcement: Announcement) {
    const user = await this.usersService.findOne(announcement.updatedBy);
    return user.fullName;
  }

  @ResolveField('deletedBy', () => String)
  async getDeletedBy(@Parent() announcement: Announcement) {
    const user = await this.usersService.findOne(announcement.deletedBy);
    return user.fullName;
  }

  @ResolveField('form', () => Form)
  async getAnnouncementForm(@Parent() announcement: Announcement) {
    const form = await this.formsService.findOne(announcement.form);
    return form;
  }

  @ResolveField('participants', () => Number)
  resolveStage(@Parent() announcement: Announcement) {
    return this.applicantService.numbApplicants(announcement._id.toString());
  }
}
