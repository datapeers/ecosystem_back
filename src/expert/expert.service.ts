import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FormDocumentService } from 'src/forms/factories/form-document-service';
import { Expert } from './entities/expert.entity';
import { UpdateResultPayload } from 'src/shared/models/update-result';

@Injectable()
export class ExpertService implements FormDocumentService {
  constructor(
    @InjectModel(Expert.name) private readonly expertModel: Model<Expert>,
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

  async findAll(): Promise<Expert[]> {
    const experts = await this.expertModel.find({});
    return experts;
  }

  async findOne(id: string): Promise<Expert> {
    const expert = await this.expertModel.findById(id);
    if(!expert) throw new NotFoundException(`Couldn't find expert with id ${id}`);
    return expert;
  }

  async create(data: Partial<Expert>): Promise<Expert> {
    const createdExpert = await this.expertModel.create(data);
    return createdExpert;
  }
  
  async update(id: string, data: Partial<Expert>): Promise<Expert> {
    const createdExpert = await this.expertModel.updateOne({ _id: id }, data, { new: true }).lean();
    return createdExpert;
  }

  async delete(ids: string[]): Promise<UpdateResultPayload> {
    const updateResult = await this.expertModel.updateMany(
      { _id: { $in: ids.map(id => new Types.ObjectId(id)) } },
      { deletedAt: Date.now() }
    );
    return {
      ...updateResult,
      upsertedId: updateResult.upsertedId?.toString()
    };
  }
}
