import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FormDocumentService } from 'src/forms/factories/form-document-service';
import { Expert } from './entities/expert.entity';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { PhaseRelationship } from 'src/startup/entities/startup.entity';
import { LinkExpertsToPhaseArgs } from './args/link-phase-expert.args';
import { LinkStartupsExpertsArgs } from './args/link-phase-startups-expert.args';

@Injectable()
export class ExpertService implements FormDocumentService {
  constructor(
    @InjectModel(Expert.name) private readonly expertModel: Model<Expert>,
  ) {}

  async getDocument(id: string) {
    const document = await this.findOne(id);
    return document;
  }

  async createDocument(submission: any, context?: any) {
    const data = {
      item: submission,
      ...context,
    };
    const createdDocument = await this.create(data);
    return createdDocument;
  }

  async updateDocument(id: string, submission: any, context: any) {
    const updatedDocument = await this.update(id, { item: submission });
    return updatedDocument;
  }

  async findAll(): Promise<Expert[]> {
    const experts = await this.expertModel.find({});
    return experts;
  }

  async findByPhase(phase: string): Promise<Expert[]> {
    const initMatch = {
      isDeleted: false,
      'phases._id': phase,
    };
    const lookUps = [];
    const project = {
      $project: {
        _id: 1,
        item: 1,
        phases: 1,
      },
    };
    const experts = await this.expertModel.aggregate([
      { $match: initMatch },
      project,
      ...lookUps,
    ]);
    // const util = require('util');
    // console.log(
    //   util.inspect(experts, { showHidden: false, depth: null, colors: true }),
    // );

    return experts;
  }

  async findByAccount(accountId: string) {
    return await this.expertModel.findOne({ accountId });
  }

  async findOne(id: string): Promise<Expert> {
    const expert = await this.expertModel.findById(id);
    if (!expert)
      throw new NotFoundException(`Couldn't find expert with id ${id}`);
    return expert;
  }

  async create(data: Partial<Expert>): Promise<Expert> {
    const createdExpert = await this.expertModel.create(data);
    return createdExpert;
  }

  async update(id: string, data: Partial<Expert>): Promise<Expert> {
    const createdExpert = await this.expertModel
      .updateOne({ _id: id }, data, { new: true })
      .lean();
    return createdExpert;
  }

  async delete(ids: string[]): Promise<UpdateResultPayload> {
    const updateResult = await this.expertModel.updateMany(
      { _id: { $in: ids.map((id) => new Types.ObjectId(id)) } },
      { deletedAt: Date.now() },
    );
    return {
      ...updateResult,
      upsertedId: updateResult.upsertedId?.toString(),
    };
  }

  async linkWithPhase(
    linkExpertsToPhaseArgs: LinkExpertsToPhaseArgs,
  ): Promise<UpdateResultPayload> {
    const phaseRelationship = {
      _id: linkExpertsToPhaseArgs.phaseId,
      name: linkExpertsToPhaseArgs.name,
      startUps: [],
    };
    return this.expertModel
      .updateMany(
        { _id: { $in: linkExpertsToPhaseArgs.experts } },
        { $addToSet: { phases: { $each: [phaseRelationship] } } },
        { new: true },
      )
      .lean();
  }

  linkStartupsToExperts(linkStartupsExpertsArgs: LinkStartupsExpertsArgs) {
    try {
      return this.expertModel.findOneAndUpdate(
        {
          _id: linkStartupsExpertsArgs.expertId,
          phases: { $elemMatch: { _id: linkStartupsExpertsArgs.phase } },
        },
        { $set: { 'phases.$.startUps': linkStartupsExpertsArgs.startUps } },
        { new: true, lean: true },
      );
    } catch (error) {
      console.warn(error);
      throw new NotFoundException(`Couldn't find expert`);
    }
  }
}
