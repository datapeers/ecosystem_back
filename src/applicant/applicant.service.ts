import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FormDocumentService } from 'src/forms/factories/form-document-service';
import { Applicant } from './entities/applicant.entity';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { AnnouncementApplicantArgs } from './args/announcement-applicant.args';
import { SubmitAnnouncementDocInput } from 'src/announcements/dto/submit-announcement-doc.input';
import { FormFileSubmission } from 'src/forms/factories/form-file-submission';
import { UpdateApplicantStateInput } from './dto/update-applicant-state.input';
import { AnnouncementApplicantsArgs } from './args/announcement-applicants.args';
import { ApplicantArgs } from './args/applicant.args';
import { AnnouncementTargets } from 'src/announcements/enums/announcement-targets.enum';
import { ExpertService } from 'src/expert/expert.service';
import { StartupService } from 'src/startup/startup.service';
import { InvitationsService } from 'src/invitations/invitations.service';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { ApplicationStates } from './enums/application-states.enum';
import { User } from 'src/users/entities/user.entity';
import { SelectApplicantsArgs } from './args/select-applicants.args';
@Injectable()
export class ApplicantService implements FormDocumentService<Applicant> {
  constructor(
    @InjectModel(Applicant.name)
    private readonly applicantModel: Model<Applicant>,
    @Inject(forwardRef(() => ExpertService))
    private readonly expertService: ExpertService,
    @Inject(forwardRef(() => StartupService))
    private readonly startupService: StartupService,
    @Inject(forwardRef(() => InvitationsService))
    private readonly invitationService: InvitationsService,
  ) {}

  async getDocument(id: string) {
    const document = await this.findOne(id);
    return document;
  }

  async createDocument(submission: any, context?: any) {
    const data = {
      ...context,
      item: submission,
    };
    const createdDocument = await this.create(data);
    return createdDocument;
  }

  async updateDocument(id: string, submission: any, context: any) {
    const updatedDocument = await this.update(id, {
      item: submission,
    });
    return updatedDocument;
  }

  async findMany({
    announcement,
    state,
  }: AnnouncementApplicantsArgs): Promise<Applicant[]> {
    const applicants = await this.applicantModel.aggregate([
      { $match: { announcement, 'states.type': state } },
      {
        $addFields: {
          state: {
            $filter: {
              input: '$states',
              as: 'state',
              cond: { $eq: ['$$state.type', state] },
            },
          },
        },
      },
      {
        $addFields: {
          state: { $arrayElemAt: ['$state', 0] },
        },
      },
    ]);
    return applicants;
  }

  async findByAnnouncement(
    filters: AnnouncementApplicantArgs,
  ): Promise<Applicant | null> {
    const applicant = await this.applicantModel
      .findOne({
        deletedAt: null,
        announcement: filters.announcement,
        participant: filters.participant,
      })
      .lean();
    if (!applicant)
      throw new NotFoundException(
        `Couldn't find applicant for announcement ${filters.announcement}`,
      );
    return applicant;
  }

  async numbApplicants(announcement: string) {
    const applicants = await this.applicantModel
      .find(
        {
          deletedAt: null,
          announcement: announcement,
        },
        { _id: 1 },
      )
      .lean();
    return applicants.length;
  }

  async handleDocumentSubmit(
    submitAnnouncementDocInput: SubmitAnnouncementDocInput,
  ): Promise<any> {
    // const announcementDoc = await this.findOne(
    //   submitAnnouncementDocInput.announcement,
    // );
    let docParticipant = submitAnnouncementDocInput.participant;
    if (
      submitAnnouncementDocInput.announcementTarget ===
      AnnouncementTargets.experts
    ) {
      const expertDoc = await this.expertService.createDocument(
        submitAnnouncementDocInput.submission,
        {},
      );
      docParticipant = expertDoc._id.toString();
    }
    const createdApplicant = await this.applicantModel.create({
      announcement: submitAnnouncementDocInput.announcement,
      participant: docParticipant,
      item: submitAnnouncementDocInput.submission,
    });
    if (!createdApplicant)
      throw new InternalServerErrorException('Failed to create applicant');
    return createdApplicant;
  }

  async uploadFile(
    id: string,
    document: FormFileSubmission,
  ): Promise<FormFileSubmission[]> {
    const applicantDoc = await this.findOne(id);
    let documents = applicantDoc?.documents ?? [];
    if (documents.some((doc) => doc.key === document.key)) {
      documents = documents.map((doc) => {
        if (doc.key === document.key) {
          return document;
        }
        return doc;
      });
    } else {
      documents.push(document);
    }
    await this.applicantModel.findOneAndUpdate(
      { _id: id },
      { $set: { documents } },
    );
    return documents;
  }

  async findOneByState({ id, state }: ApplicantArgs) {
    const applicants = await this.applicantModel.aggregate([
      { $match: { _id: new Types.ObjectId(id), 'states.type': state } },
      // { $unwind: '$states' },
      // { $match: { 'states.type': state } },
      // { $addFields: { state: '$states' } },
      {
        $addFields: {
          state: {
            $filter: {
              input: '$states',
              as: 'state',
              cond: { $eq: ['$$state.type', state] },
            },
          },
        },
      },
      {
        $addFields: {
          state: { $arrayElemAt: ['$state', 0] },
        },
      },
    ]);
    if (!applicants.length)
      throw new NotFoundException(
        `Couldn't find applicant with id ${id} and state ${state}`,
      );
    return applicants[0];
  }

  async findOne(id: string): Promise<Applicant> {
    const applicant = await this.applicantModel.findById(id);
    if (!applicant)
      throw new NotFoundException(`Couldn't find applicant with id ${id}`);
    return applicant;
  }

  async create(data: Partial<Applicant>): Promise<Applicant> {
    const createdApplicant = await this.applicantModel.create(data);
    return createdApplicant;
  }

  async update(id: string, data: Partial<Applicant>): Promise<Applicant> {
    await this.applicantModel
      .updateOne({ _id: id }, data, { new: true })
      .lean();
    const doc = await this.findOne(id);
    return doc;
  }

  async delete(ids: string[]): Promise<UpdateResultPayload> {
    const updateResult = await this.applicantModel.updateMany(
      { _id: { $in: ids.map((id) => new Types.ObjectId(id)) } },
      { deletedAt: Date.now() },
    );
    return {
      ...updateResult,
      upsertedId: updateResult.upsertedId?.toString(),
    };
  }

  async updateState({ id, notes, documents, type }: UpdateApplicantStateInput) {
    const applicant = await this.findOne(id);
    let { states } = applicant;
    states = states.filter((state) => state.type != type);
    states.push({ notes, documents, type });
    const updateResult = await this.update(id, { states });
    return updateResult;
  }

  async selectedApplicant(
    selectApplicantsArgsInput: SelectApplicantsArgs,
    adminUser: User,
  ) {
    const applicant = await this.findOne(selectApplicantsArgsInput.idApplicant);
    switch (selectApplicantsArgsInput.typeApplicant) {
      case AnnouncementTargets.entrepreneurs:
        // if (!applicant.participant) this.inviteApplicant()
        break;
      case AnnouncementTargets.experts:
        const invitationExpert = await this.invitationService.create(
          {
            email: applicant.item['correoElectronico'],
            rol: ValidRoles.expert,
          },
          adminUser,
        );
        await this.expertService.assignAccountAndLinkBatch(
          invitationExpert.metadata['uidAccount'],
          {
            phaseId: selectApplicantsArgsInput.idBatch,
            name: selectApplicantsArgsInput.nameBatch,
            experts: [applicant.participant],
          },
        );
        break;
      default:
        break;
    }
    let { states } = applicant;
    states.push({ notes: '', documents: [], type: ApplicationStates.selected });
    const updateResult = await this.update(applicant._id, {
      states,
      batch: {
        idDoc: selectApplicantsArgsInput.idBatch,
        nombre: selectApplicantsArgsInput.nameBatch,
      },
    });
    return updateResult;
  }
}
