import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FormDocumentService } from 'src/forms/factories/form-document-service';
import { Applicant } from './entities/applicant.entity';
import { UpdateResultPayload } from 'src/shared/models/update-result';

@Injectable()
export class ApplicantService implements FormDocumentService<Applicant>  {
  constructor(
    @InjectModel(Applicant.name) private readonly applicantModel: Model<Applicant>,
  ) {

  }

  async getDocument(id: string) {
    const document = await this.findOne(id);
    return document;
  };

  async createDocument(submission: any) {
    const data = {
      item: submission
    };
    const createdDocument = await this.create(data);
    return createdDocument;
  };

  async updateDocument(id: string, submission: any) {
    const updatedDocument = await this.update(
      id,
      { item: submission }
    );
    return updatedDocument;
  };

  async findAll(): Promise<Applicant[]> {
    const applicants = await this.applicantModel.find({});
    return applicants;
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
