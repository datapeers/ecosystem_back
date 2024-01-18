import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
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
import { EntrepreneurService } from 'src/entrepreneur/entrepreneur.service';
import { Entrepreneur } from 'src/entrepreneur/entities/entrepreneur.entity';
import { Startup } from 'src/startup/entities/startup.entity';
@Injectable()
export class ApplicantService implements FormDocumentService<Applicant> {
  constructor(
    @InjectModel(Applicant.name)
    private readonly applicantModel: Model<Applicant>,
    @Inject(forwardRef(() => ExpertService))
    private readonly expertService: ExpertService,
    @Inject(forwardRef(() => EntrepreneurService))
    private readonly entrepreneurService: EntrepreneurService,
    @Inject(forwardRef(() => StartupService))
    private readonly startupService: StartupService,
    @Inject(forwardRef(() => InvitationsService))
    private readonly invitationService: InvitationsService,
  ) {}

  /**
   * find doc applicant, is only intended to be used by websocket.
   * @returns announcement
   */
  async getDocument(id: string) {
    const document = await this.findOne(id);
    return document;
  }

  /**
   * create applicant document, is only intended to be used by websocket.
   */
  async createDocument(submission: any, context?: any) {
    const data = {
      ...context,
      item: submission,
    };
    const createdDocument = await this.create(data);
    return createdDocument;
  }

  /**
   * update applicant document, is only intended to be used by websocket.
   */
  async updateDocument(id: string, submission: any, context: any) {
    const updatedDocument = await this.update(id, {
      item: submission,
    });
    return updatedDocument;
  }

  /**
   * find applicant document by type and state
   */
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

  /**
   * find applicant documents by announcement
   */
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

  /**
   * find numb of applicant documents
   */
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

  /**
   * handle applicant documents by websocket
   */
  async handleDocumentSubmit(
    submitAnnouncementDocInput: SubmitAnnouncementDocInput,
  ): Promise<any> {
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

  /**
   * upload files urls of applicant documents
   */
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

  /**
   * find applicant documents by id and state
   */
  async findOneByState({ id, state }: ApplicantArgs) {
    const applicants = await this.applicantModel.aggregate([
      { $match: { _id: new Types.ObjectId(id), 'states.type': state } },
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

  /**
   * find applicant documents by id
   */
  async findOne(id: string): Promise<Applicant> {
    const applicant = await this.applicantModel.findById(id);
    if (!applicant)
      throw new NotFoundException(`Couldn't find applicant with id ${id}`);
    return applicant;
  }

  /**
   * create applicant document
   */
  async create(data: Partial<Applicant>): Promise<Applicant> {
    const createdApplicant = await this.applicantModel.create(data);
    return createdApplicant;
  }

  /**
   * update applicant documents
   */
  async update(id: string, data: Partial<Applicant>): Promise<Applicant> {
    await this.applicantModel
      .updateOne({ _id: id }, data, { new: true })
      .lean();
    const doc = await this.findOne(id);
    return doc;
  }

  /**
   * soft delete of many applicant document
   */
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

  /**
   * update states of many applicant document
   */
  async updateState({ id, notes, documents, type }: UpdateApplicantStateInput) {
    const applicant = await this.findOne(id);
    let { states } = applicant;
    states = states.filter((state) => state.type != type);
    states.push({ notes, documents, type });
    const updateResult = await this.update(id, { states });
    return updateResult;
  }

  /**
   * update states of many applicant document to selected
   */
  async selectedApplicant(
    selectApplicantsArgsInput: SelectApplicantsArgs,
    adminUser: User,
  ) {
    const applicant = await this.findOne(selectApplicantsArgsInput.idApplicant);
    switch (selectApplicantsArgsInput.typeApplicant) {
      case AnnouncementTargets.entrepreneurs:
        await this.inviteApplicantStartup(
          selectApplicantsArgsInput,
          adminUser,
          applicant,
        );
        break;
      case AnnouncementTargets.experts:
        await this.inviteExpertApplicant(
          selectApplicantsArgsInput,
          adminUser,
          applicant,
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

  /**
   * find applicant document for expert announcement, send email of invitation, and link new account of that expert to expert doc
   */
  async inviteExpertApplicant(
    selectApplicantsArgsInput: SelectApplicantsArgs,
    adminUser: User,
    applicant: Applicant,
  ) {
    const prevInvitation = await this.invitationService.tryFindOneByEmail(
      applicant.item[selectApplicantsArgsInput.metadata['emailField']],
    );
    if (prevInvitation) {
      throw new BadRequestException(
        'Este email ya ha sido invitado a entrar en ecosystem, por favor revizar la sección de invitaciones',
      );
    }
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
    return;
  }

  /**
   * find applicant document for startup announcement, send email of invitation, and link new account of that startup to startup doc
   */
  async inviteApplicantStartup(
    selectApplicantsArgsInput: SelectApplicantsArgs,
    adminUser: User,
    applicant: Applicant,
  ) {
    let entrepreneur: Entrepreneur;
    if (!applicant.participant || applicant.participant === 'undefined') {
      let item: any = {
        nombre: applicant.item[selectApplicantsArgsInput.metadata['nameField']],
        email: applicant.item[selectApplicantsArgsInput.metadata['emailField']],
      };
      entrepreneur = await this.entrepreneurService.create({
        item,
      });
      await this.update(applicant._id, { participant: entrepreneur._id });
    } else {
      entrepreneur = await this.entrepreneurService.findOne(
        applicant.participant,
      );
    }
    let startup = await this.findStartupApplicant(
      selectApplicantsArgsInput,
      entrepreneur,
    );
    const prevInvitation = await this.invitationService.tryFindOneByEmail(
      applicant.item[selectApplicantsArgsInput.metadata['emailField']],
    );
    if (prevInvitation) {
      throw new BadRequestException(
        'Este email ya ha sido invitado a entrar en ecosystem, por favor revizar la sección de invitaciones',
      );
    }
    // Participant have entrepreneur and a STARTUP
    const invitationExpert = await this.invitationService.create(
      {
        email: applicant.item[selectApplicantsArgsInput.metadata['emailField']],
        rol: ValidRoles.user,
      },
      adminUser,
      {
        idBatch: selectApplicantsArgsInput.idBatch,
        idApplicant: selectApplicantsArgsInput.idApplicant,
      },
    );
    await this.entrepreneurService.update(entrepreneur._id.toString(), {
      accountId: invitationExpert.metadata['uidAccount'],
    });
    await this.startupService.linkWithPhase({
      phaseId: selectApplicantsArgsInput.idBatch,
      name: selectApplicantsArgsInput.nameBatch,
      startups: [startup._id.toString()],
    });
    return entrepreneur;
  }

  /**
   * generates the necessary links between the documents of the entrepreneur and his startup that applied to announcement and its selected.
   */
  async findStartupApplicant(
    selectApplicantsArgsInput,
    entrepreneurDoc: Entrepreneur,
  ) {
    if (
      selectApplicantsArgsInput.metadata['phaseBase'] !==
        '65242ea3baa24cae19bd5baf' &&
      entrepreneurDoc.startups.length === 0
    )
      throw new ForbiddenException(
        `No se puede agregar un participante sin startup a una fase superior a la 1`,
      );
    if (
      selectApplicantsArgsInput.metadata['phaseBase'] ===
        '65242ea3baa24cae19bd5baf' &&
      entrepreneurDoc.startups.length === 0
    ) {
      // If the batch its phase 1 create generic startup
      const docStartup = await this.startupService.genericStartup();
      await this.startupService.linkStartupsAndEntrepreneurs(
        [docStartup._id.toString()],
        [entrepreneurDoc._id.toString()],
      );
      return docStartup;
    } else {
      const docStartupEntrepreneur = await this.startupService.findOne(
        entrepreneurDoc.startups[0]._id.toString(),
      );
      return docStartupEntrepreneur;
    }
  }
}
