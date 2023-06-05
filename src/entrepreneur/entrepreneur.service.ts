import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BusinessRelationship, Entrepreneur, StartupRelationship } from './entities/entrepreneur.entity';
import { Model, Types } from 'mongoose';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { FormDocumentService } from 'src/forms/factories/form-document-service';
import { BusinessService } from '../business/business.service';

@Injectable()
export class EntrepreneurService implements FormDocumentService<Entrepreneur> {
  constructor(
    @InjectModel(Entrepreneur.name) private readonly entrepreneurModel: Model<Entrepreneur>,
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

  async findAll(): Promise<Entrepreneur[]> {
    const entrepreneurs = await this.entrepreneurModel.find({});
    return entrepreneurs;
  }

  async findMany(ids: string[]): Promise<Entrepreneur[]> {
    const entrepreneurs = await this.entrepreneurModel.find({ _id: { $in: ids } });
    return entrepreneurs;
  }

  async findOne(id: string): Promise<Entrepreneur> {
    const entrepreneur = await this.entrepreneurModel.findById(id);
    if(!entrepreneur) throw new NotFoundException(`Couldn't find entrepreneur with id ${id}`);
    return entrepreneur;
  }

  async create(data: Partial<Entrepreneur>): Promise<Entrepreneur> {
    const createdEntrepreneur = await this.entrepreneurModel.create(data);
    return createdEntrepreneur;
  }
  
  async update(id: string, data: Partial<Entrepreneur>): Promise<Entrepreneur> {
    const createdEntrepreneur = await this.entrepreneurModel.updateOne({ _id: id }, data, { new: true }).lean();
    return createdEntrepreneur;
  }

  async linkToBusinesses(ids: string[], businessesRelationships: BusinessRelationship[]): Promise<UpdateResultPayload> {
    return await this.entrepreneurModel.updateMany(
      { _id: { $in: ids } },
      { $addToSet: { businesses: { $each: businessesRelationships } } },
      { new: true }
    ).lean();
  }

  async linkToStartups(ids: string[], startupsRelationships: StartupRelationship[]): Promise<UpdateResultPayload> {
    return await this.entrepreneurModel.updateMany(
      { _id: { $in: ids } },
      { $addToSet: { startups: { $each: startupsRelationships } } },
      { new: true }
    ).lean();
  }

  async delete(ids: string[]): Promise<UpdateResultPayload> {
    const updateResult = await this.entrepreneurModel.updateMany(
      { _id: { $in: ids.map(id => new Types.ObjectId(id)) } },
      { deletedAt: Date.now() }
    );
    return {
      ...updateResult,
      upsertedId: updateResult.upsertedId?.toString()
    };
  }
}
