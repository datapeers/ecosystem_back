import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FormDocumentService } from 'src/forms/factories/form-document-service';
import { Investor } from './entities/investor.entity';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { AggregateBuildOptions } from 'src/shared/models/aggregate-build-options';
import { PageRequest } from 'src/shared/models/page-request';
import { PaginatedResult } from 'src/shared/models/paginated-result';
import { requestUtilities } from 'src/shared/utilities/request.utilities';

@Injectable()
export class InvestorService implements FormDocumentService<Investor> {
  constructor(
    @InjectModel(Investor.name) private readonly investorModel: Model<Investor>,
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

  async findAll(): Promise<Investor[]> {
    const investors = await this.investorModel.find({ deletedAt: null });
    return investors;
  }

  async findManyPage(request: PageRequest): Promise<PaginatedResult<Investor>> {
    const options = new AggregateBuildOptions();
    const aggregationPipeline = requestUtilities.buildAggregationFromRequest(request, options);
    const documents = await this.investorModel.aggregate<PaginatedResult<Investor>>(aggregationPipeline).collation({ locale: "en_US", strength: 2 });
    return documents[0];
  }

  async findOne(id: string): Promise<Investor> {
    const investor = await this.investorModel.findById(id);
    if(!investor) throw new NotFoundException(`Couldn't find investor with id ${id}`);
    return investor;
  }

  async create(data: Partial<Investor>): Promise<Investor> {
    const createdInvestor = await this.investorModel.create(data);
    return createdInvestor;
  }
  
  async update(id: string, data: Partial<Investor>): Promise<Investor> {
    const createdInvestor = await this.investorModel.updateOne({ _id: id }, data, { new: true }).lean();
    return createdInvestor;
  }

  async delete(ids: string[]): Promise<UpdateResultPayload> {
    const updateResult = await this.investorModel.updateMany(
      { _id: { $in: ids.map(id => new Types.ObjectId(id)) } },
      { deletedAt: Date.now() }
    );
    return {
      ...updateResult,
      upsertedId: updateResult.upsertedId?.toString()
    };
  }
}
