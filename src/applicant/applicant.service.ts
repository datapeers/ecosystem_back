import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FormDocumentService } from 'src/forms/factories/form-document-service';
import { Applicant } from './entities/applicant.entity';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { AnnouncementApplicantArgs } from './args/announcement-applicant.args';
import { SubmitAnnouncementDocInput } from 'src/announcements/dto/submit-announcement-doc.input';
import { FormFileSubmission } from 'src/forms/factories/form-file-submission';
@Injectable()
export class ApplicantService implements FormDocumentService<Applicant> {
  constructor(
    @InjectModel(Applicant.name) private readonly applicantModel: Model<Applicant>,
  ) {

  }

  async getDocument(id: string) {
    const document = await this.findOne(id);
    return document;
  };

  async createDocument(submission: any, context?: any) {
    const data = {
      item: submission
    };
    const createdDocument = await this.create(data);
    return createdDocument;
  };

  async updateDocument(id: string, submission: any, context: any) {
    const updatedDocument = await this.update(
      id,
      { item: submission }
    );
    return updatedDocument;
  };

  async findMany(announcement: string): Promise<Applicant[]> {
    const applicants = await this.applicantModel.find({ announcement });
    return applicants;
  }

  async findByAnnouncement(filters: AnnouncementApplicantArgs): Promise<Applicant | null> {
    const applicant = await this.applicantModel.findOne({
      announcement: filters.announcement,
      participant: filters.participant,
    }).lean();
    if(!applicant) throw new NotFoundException(`Couldn't find applicant for announcement ${filters.announcement}`);
    return applicant;
  }

  async handleDocumentSubmit(submitAnnouncementDocInput: SubmitAnnouncementDocInput): Promise<any> {
    const createdApplicant = await this.applicantModel.create({
      announcement: submitAnnouncementDocInput.announcement,
      participant: submitAnnouncementDocInput.participant,
      item: submitAnnouncementDocInput.submission
    });
    if(!createdApplicant) throw new InternalServerErrorException("Failed to create applicant");
    return createdApplicant;
  }

  async uploadFile(id: string, document: FormFileSubmission): Promise<FormFileSubmission[]> {
    const applicantDoc = await this.findOne(id);
    let documents = applicantDoc?.documents ?? [];
    if(documents.some(doc => doc.key === document.key)) {
      documents = documents.map(doc => {
        if(doc.key === document.key) {
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

  async findOne(id: string): Promise<Applicant> {
    const applicant = await this.applicantModel.findById(id);
    if(!applicant) throw new NotFoundException(`Couldn't find applicant with id ${id}`);
    return applicant;
  }

  async create(data: Partial<Applicant>): Promise<Applicant> {
    const createdApplicant = await this.applicantModel.create(data);
    return createdApplicant;
  }
  
  async update(id: string, data: Partial<Applicant>): Promise<Applicant> {
    const createdApplicant = await this.applicantModel.updateOne({ _id: id }, data, { new: true }).lean();
    return createdApplicant;
  }

  async delete(ids: string[]): Promise<UpdateResultPayload> {
    const updateResult = await this.applicantModel.updateMany(
      { _id: { $in: ids.map(id => new Types.ObjectId(id)) } },
      { deletedAt: Date.now() }
    );
    return {
      ...updateResult,
      upsertedId: updateResult.upsertedId?.toString()
    };
  }
}
