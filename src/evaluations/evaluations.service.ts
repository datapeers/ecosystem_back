import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEvaluationInput } from './dto/create-evaluation.input';
import { InjectModel } from '@nestjs/mongoose';
import { Evaluation } from './entities/evaluation.entity';
import { Model, Types } from 'mongoose';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { FormFileSubmission } from 'src/forms/factories/form-file-submission';

@Injectable()
export class EvaluationsService {
  constructor(
    @InjectModel(Evaluation.name)
    private readonly evaluationModel: Model<Evaluation>,
  ) {}

  async getDocument(id: string) {
    const document = await this.findOne(id);
    return document;
  }

  async createDocument(submission: any, context?: any) {
    const data = {
      ...context,
      item: submission,
    };
    const createdDocument = await this.create(data);
    return createdDocument;
  }

  async updateDocument(id: string, submission: any, context: any) {
    const updatedDocument = await this.update(id, { item: submission });
    return updatedDocument;
  }

  findAll() {
    return this.evaluationModel.find();
  }

  async findOne(id: string): Promise<Evaluation> {
    const evaluation = await this.evaluationModel.findById(id);
    if (!evaluation)
      throw new NotFoundException(`Couldn't find evaluation with id ${id}`);
    return evaluation;
  }

  async create(data: CreateEvaluationInput): Promise<Evaluation> {
    const createdEvaluation = await this.evaluationModel.create(data);
    return createdEvaluation;
  }

  async update(id: string, data: Partial<Evaluation>): Promise<Evaluation> {
    const evaluation = await this.evaluationModel
      .updateOne({ _id: id }, data, { new: true })
      .lean();
    return evaluation;
  }

  async delete(ids: string[]): Promise<UpdateResultPayload> {
    const updateResult = await this.evaluationModel.updateMany(
      { _id: { $in: ids.map((id) => new Types.ObjectId(id)) } },
      { isDeleted: true },
    );
    return {
      ...updateResult,
      upsertedId: updateResult.upsertedId?.toString(),
    };
  }
}
