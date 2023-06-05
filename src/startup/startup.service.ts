import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { EntrepreneurRelationship, Startup } from './entities/startup.entity';
import { FormDocumentService } from 'src/forms/factories/form-document-service';
import { EntrepreneurService } from 'src/entrepreneur/entrepreneur.service';

@Injectable()
export class StartupService implements FormDocumentService<Startup> {
  constructor(
    @InjectModel(Startup.name) private readonly startupModel: Model<Startup>,
    private readonly entrepreneurService: EntrepreneurService,
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
    if(context && context.entrepreneur) {
      const entrepreneur = context.entrepreneur;
      const linkResult = await this.linkStartupsAndEntrepreneurs([createdDocument._id], [entrepreneur]);
      if(!linkResult.acknowledged) throw new InternalServerErrorException("Failed to link entrepreneur with startup");
    }
    return createdDocument;
  };

  async linkStartupsAndEntrepreneurs(ids: string[], entrepreneurs: string[]): Promise<UpdateResultPayload> {
    // Find bussinesses by ids
    const startups = await this.findMany(ids);

    // Link entrepreneurs to bussinesses by given relationships
    const startupsToLink = startups.map(startup => {
      return { _id: startup._id, item: startup.item, };
    });
    const entrepreneurUpdateResult = await this.entrepreneurService.linkToStartups(entrepreneurs, startupsToLink);

    if(!entrepreneurUpdateResult.acknowledged) throw new InternalServerErrorException("Failed to create link between startups and entrepreneurs");

    // Find entrepreneurs
    const entrepreneurDocuments = await this.entrepreneurService.findMany(entrepreneurs);
    const entrepreneurRelationships = entrepreneurDocuments.map((document) => {
      return { _id: document._id, item: document.item, }
    });
    const startupUpdateResult = await this.linkWithEntrepreneurs(ids, entrepreneurRelationships);
    return startupUpdateResult;
  }

  async linkWithEntrepreneurs(ids: string[], entrepreneurRelationships: EntrepreneurRelationship[]): Promise<UpdateResultPayload> {
    return this.startupModel.updateMany(
      { _id: { $in: ids } },
      { $addToSet: { entrepreneurs: { $each: entrepreneurRelationships } } },
      { new: true }
    ).lean();
  }

  async updateDocument(id: string, submission: any, context: any) {
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

  async findMany(ids: string[]): Promise<Startup[]> {
    const startups = await this.startupModel.find({
      _id: { $in: ids }
    });
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
