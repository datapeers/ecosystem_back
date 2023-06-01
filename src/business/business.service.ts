import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { Business } from './entities/business.entity';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business.name) private readonly businessModel: Model<Business>,
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

  async findAll(): Promise<Business[]> {
    const businesses = await this.businessModel.find({});
    return businesses;
  }

  async findOne(id: string): Promise<Business> {
    const business = await this.businessModel.findById(id);
    if(!business) throw new NotFoundException(`Couldn't find business with id ${id}`);
    return business;
  }

  async create(data: Partial<Business>): Promise<Business> {
    const createdBusiness = await this.businessModel.create(data);
    return createdBusiness;
  }
  
  async update(id: string, data: Partial<Business>): Promise<Business> {
    const createdBusiness = await this.businessModel.updateOne({ _id: id }, data, { new: true }).lean();
    return createdBusiness;
  }

  async delete(ids: string[]): Promise<UpdateResultPayload> {
    const updateResult = await this.businessModel.updateMany(
      { _id: { $in: ids.map(id => new Types.ObjectId(id)) } },
      { deletedAt: Date.now() }
    );
    return {
      ...updateResult,
      upsertedId: updateResult.upsertedId?.toString()
    };
  }
}
