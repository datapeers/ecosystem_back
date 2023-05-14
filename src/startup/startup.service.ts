import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { Startup } from './entities/startup.entity';
import { FormDocumentService } from 'src/forms/factories/form-document-service';

@Injectable()
export class StartupService implements FormDocumentService<Startup> {
  constructor(
    @InjectModel(Startup.name) private readonly startupModel: Model<Startup>,
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

  async findAll(): Promise<Startup[]> {
    const startups = await this.startupModel.find({});
    return startups;
  }

  async findOne(id: string): Promise<Startup> {
    const startup = await this.startupModel.findById(id);
    if(!startup) throw new NotFoundException(`Couldn't find startup with id ${id}`);
    return startup;
  }

  async create(data: Partial<Startup>): Promise<Startup> {
    const createdStartup = await this.startupModel.create(data);
    return createdStartup;
  }
  
  async update(id: string, data: Partial<Startup>): Promise<Startup> {
    const createdStartup = await this.startupModel.updateOne({ _id: id }, data, { new: true }).lean();
    return createdStartup;
  }

  async delete(ids: string[]): Promise<UpdateResultPayload> {
    const updateResult = await this.startupModel.updateMany(
      { _id: { $in: ids.map(id => new Types.ObjectId(id)) } },
      { deletedAt: Date.now() }
    );
    return {
      ...updateResult,
      upsertedId: updateResult.upsertedId?.toString()
    };
  }
}
