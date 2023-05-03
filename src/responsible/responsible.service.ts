import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FormDocumentService } from 'src/forms/factories/form-document-service';
import { Responsible } from './entities/responsible.entity';
import { UpdateResultPayload } from 'src/shared/models/update-result';

@Injectable()
export class ResponsibleService implements FormDocumentService {
  constructor(
    @InjectModel(Responsible.name) private readonly responsibleModel: Model<Responsible>,
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

  async findAll(): Promise<Responsible[]> {
    const responsibles = await this.responsibleModel.find({});
    return responsibles;
  }

  async findOne(id: string): Promise<Responsible> {
    const responsible = await this.responsibleModel.findById(id);
    if(!responsible) throw new NotFoundException(`Couldn't find responsible with id ${id}`);
    return responsible;
  }

  async create(data: Partial<Responsible>): Promise<Responsible> {
    const createdResponsible = await this.responsibleModel.create(data);
    return createdResponsible;
  }
  
  async update(id: string, data: Partial<Responsible>): Promise<Responsible> {
    const createdResponsible = await this.responsibleModel.updateOne({ _id: id }, data, { new: true }).lean();
    return createdResponsible;
  }

  async delete(ids: string[]): Promise<UpdateResultPayload> {
    const updateResult = await this.responsibleModel.updateMany(
      { _id: { $in: ids.map(id => new Types.ObjectId(id)) } },
      { isDeleted: true }
    );
    return {
      ...updateResult,
      upsertedId: updateResult.upsertedId?.toString()
    };
  }
}
