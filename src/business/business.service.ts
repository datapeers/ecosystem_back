import { Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { Business, EntrepreneurRelationship } from './entities/business.entity';
import { EntrepreneurService } from '../entrepreneur/entrepreneur.service';
import { PageRequest } from 'src/shared/models/page-request';
import { AggregateBuildOptions } from 'src/shared/models/aggregate-build-options';
import { PaginatedResult } from 'src/shared/models/paginated-result';
import { requestUtilities } from 'src/shared/utilities/request.utilities';
import { LinkWithTargetsByRequestArgs } from 'src/shared/args/link-with-targets-by-request.args';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business.name) private readonly businessModel: Model<Business>,
    @Inject(forwardRef(() => EntrepreneurService))
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
      const linkResult = await this.linkBusinessesAndEntrepreneurs([createdDocument._id], [entrepreneur]);
      if(!linkResult.acknowledged) throw new InternalServerErrorException("Failed to link entrepreneur with business");
    }
    return createdDocument;
  };

  async updateDocument(id: string, submission: any, context: any) {
    const updatedDocument = await this.update(
      id,
      { item: submission }
    );
    return updatedDocument;
  };

  async findAll(): Promise<Business[]> {
    const businesses = await this.businessModel.find({ deletedAt: null });
    return businesses;
  }

  async findMany(ids: string[]): Promise<Business[]> {
    const businesses = await this.businessModel.find({
      _id: { $in: ids }
    });
    return businesses;
  }

  async findManyPage(request: PageRequest): Promise<PaginatedResult<Business>> {
    const options = new AggregateBuildOptions();
    const aggregationPipeline = requestUtilities.buildAggregationFromRequest(request, options);
    const documents = await this.businessModel.aggregate(aggregationPipeline).collation({ locale: "en_US", strength: 2 });
    return documents[0];
  }

  async findManyIdsByRequest(request: PageRequest): Promise<string[]> {
    const options = new AggregateBuildOptions();
    options.paginated = false;
    options.outputProjection = { $project: { _id: 1 } };
    const aggregationPipeline = requestUtilities.buildAggregationFromRequest(request, options);
    const documents = await this.businessModel.aggregate(aggregationPipeline).collation({ locale: "en_US", strength: 2 });
    return documents.map(doc => doc._id);
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

  async linkBusinessesAndEntrepreneurs(ids: string[], entrepreneurs: string[]): Promise<UpdateResultPayload> {
    // Find businesses by ids
    const businesses = await this.findMany(ids);

    // Link entrepreneurs to businesses by given relationships
    const businessesToLink = businesses.map(document => {
      return { _id: document._id, item: document.item, };
    });
    const entrepreneurUpdateResult = await this.entrepreneurService.linkWithBusinesses(entrepreneurs, businessesToLink);

    if(!entrepreneurUpdateResult.acknowledged) throw new InternalServerErrorException("Failed to create link between businesses and entrepreneurs");

    // Find entrepreneurs
    const entrepreneurDocuments = await this.entrepreneurService.findMany(entrepreneurs);
    const entrepreneurRelationships = entrepreneurDocuments.map((document) => {
      return { _id: document._id, item: document.item, }
    });
    const businessUpdateResult = await this.linkWithEntrepreneurs(ids, entrepreneurRelationships);
    return businessUpdateResult;
  }

  async linkWithEntrepreneurs(ids: string[], entrepreneurRelationships: EntrepreneurRelationship[]): Promise<UpdateResultPayload> {
    return this.businessModel.updateMany(
      { _id: { $in: ids } },
      { $addToSet: { entrepreneurs: { $each: entrepreneurRelationships } } },
      { new: true }
    ).lean();
  }

  async linkWithEntrepreneursByRequest({ request, targetIds }: LinkWithTargetsByRequestArgs) {
    const businesses = await this.findManyIdsByRequest(request);
    return await this.linkBusinessesAndEntrepreneurs(businesses, targetIds);
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
