import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BusinessRelationship,
  Entrepreneur,
  StartupRelationship,
} from './entities/entrepreneur.entity';
import { Model, Types } from 'mongoose';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { FormDocumentService } from 'src/forms/factories/form-document-service';
import { PaginatedResult } from 'src/shared/models/paginated-result';
import { PageRequest } from '../shared/models/page-request';
import { requestUtilities } from 'src/shared/utilities/request.utilities';
import { LinkWithTargetsByRequestArgs } from 'src/shared/args/link-with-targets-by-request.args';
import { BusinessService } from 'src/business/business.service';
import { AggregateBuildOptions } from 'src/shared/models/aggregate-build-options';
import { StartupService } from 'src/startup/startup.service';
import { AuthUser } from 'src/auth/types/auth-user';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { ExpertService } from 'src/expert/expert.service';

@Injectable()
export class EntrepreneurService implements FormDocumentService<Entrepreneur> {
  constructor(
    @InjectModel(Entrepreneur.name)
    private readonly entrepreneurModel: Model<Entrepreneur>,
    @Inject(forwardRef(() => BusinessService))
    private readonly businessService: BusinessService,
    @Inject(forwardRef(() => StartupService))
    private readonly startupService: StartupService,
    @Inject(forwardRef(() => ExpertService))
    private readonly expertService: ExpertService,
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

  async findAll(): Promise<Entrepreneur[]> {
    const entrepreneurs = await this.entrepreneurModel.find({
      deletedAt: null,
    });
    return entrepreneurs;
  }

  async findManyPage(
    request: PageRequest,
    user: AuthUser,
  ): Promise<PaginatedResult<Entrepreneur>> {
    const options = new AggregateBuildOptions();
    const aggregationPipeline = requestUtilities.buildAggregationFromRequest(
      request,
      options,
    );
    if (user.rolDoc.type === ValidRoles.expert) {
      const docExpert = await this.expertService.findByAccount(user.uid);
      const idStartups = docExpert.phases.flatMap((phaseProfile) =>
        phaseProfile.startUps.map((startup) => new Types.ObjectId(startup._id)),
      );
      aggregationPipeline[0]['$match']['startups._id'] = { $in: idStartups };
    }
    if (user.rolDoc.type === ValidRoles.teamCoach) {
      let startupsTeamCoach =
        user.relationsAssign?.startups.map((i) => new Types.ObjectId(i._id)) ??
        [];
      aggregationPipeline[0]['$match']['startups._id'] = {
        $in: startupsTeamCoach,
      };
    }
    const documents = await this.entrepreneurModel
      .aggregate<PaginatedResult<Entrepreneur>>(aggregationPipeline)
      .collation({ locale: 'en_US', strength: 2 });
    return documents[0];
  }

  async findManyIdsByRequest(request: PageRequest): Promise<string[]> {
    const options = new AggregateBuildOptions();
    options.paginated = false;
    options.outputProjection = { $project: { _id: 1 } };
    const aggregationPipeline = requestUtilities.buildAggregationFromRequest(
      request,
      options,
    );
    const documents = await this.entrepreneurModel
      .aggregate<Entrepreneur>(aggregationPipeline)
      .collation({ locale: 'en_US', strength: 2 });
    return documents.map((doc) => doc._id);
  }

  async findMany(ids: string[]): Promise<Entrepreneur[]> {
    const entrepreneurs = await this.entrepreneurModel.find({
      _id: { $in: ids },
      deletedAt: null,
    });
    return entrepreneurs;
  }

  async findOne(id: string): Promise<Entrepreneur> {
    const entrepreneur = await this.entrepreneurModel.findOne({
      _id: id,
      deletedAt: null,
    });
    if (!entrepreneur)
      throw new NotFoundException(`Couldn't find entrepreneur with id ${id}`);
    return entrepreneur;
  }

  async findByAccount(accountId: string) {
    return await this.entrepreneurModel.findOne({ accountId }).lean();
  }

  async create(data: Partial<Entrepreneur>): Promise<Entrepreneur> {
    const createdEntrepreneur = await this.entrepreneurModel.create(data);
    return createdEntrepreneur;
  }

  async update(id: string, data: Partial<Entrepreneur>): Promise<Entrepreneur> {
    const createdEntrepreneur = await this.entrepreneurModel
      .updateOne({ _id: id }, data, { new: true })
      .lean();
    return createdEntrepreneur;
  }

  async linkWithBusinesses(
    ids: string[],
    businessesRelationships: BusinessRelationship[],
  ): Promise<UpdateResultPayload> {
    return await this.entrepreneurModel
      .updateMany(
        { _id: { $in: ids } },
        { $addToSet: { businesses: { $each: businessesRelationships } } },
        { new: true },
      )
      .lean();
  }

  async linkWithStartups(
    ids: string[],
    startupsRelationships: StartupRelationship[],
  ): Promise<UpdateResultPayload> {
    return await this.entrepreneurModel
      .updateMany(
        { _id: { $in: ids } },
        { $addToSet: { startups: { $each: startupsRelationships } } },
        { new: true },
      )
      .lean();
  }

  async delete(ids: string[]): Promise<UpdateResultPayload> {
    const updateResult = await this.entrepreneurModel.updateMany(
      { _id: { $in: ids.map((id) => new Types.ObjectId(id)) } },
      { deletedAt: Date.now() },
    );
    return {
      ...updateResult,
      upsertedId: updateResult.upsertedId?.toString(),
    };
  }

  async linkWithBusinessesByRequest({
    request,
    targetIds,
  }: LinkWithTargetsByRequestArgs) {
    const entrepreneurs = await this.findManyIdsByRequest(request);
    return await this.linkEntrepreneursAndBusinesses(entrepreneurs, targetIds);
  }

  async linkEntrepreneursAndBusinesses(ids: string[], businesses: string[]) {
    // Find entrepreneurs by ids
    const entrepreneurs = await this.findMany(ids);

    // Link entrepreneurs to businesses by given relationships
    const entrepreneursToLink = entrepreneurs.map((document) => {
      return { _id: document._id, item: document.item };
    });
    const businessUpdateResult =
      await this.businessService.linkWithEntrepreneurs(
        businesses,
        entrepreneursToLink,
      );

    if (!businessUpdateResult.acknowledged)
      throw new InternalServerErrorException(
        'Failed to create link between businesses and entrepreneurs',
      );

    // Find entrepreneurs
    const businessDocuments = await this.businessService.findMany(businesses);
    const businessRelationships = businessDocuments.map((document) => {
      return { _id: document._id, item: document.item };
    });
    const entrepreneurUpdateResult = await this.linkWithBusinesses(
      ids,
      businessRelationships,
    );
    return entrepreneurUpdateResult;
  }

  async linkWithStartupsByRequest({
    request,
    targetIds,
  }: LinkWithTargetsByRequestArgs) {
    const entrepreneurs = await this.findManyIdsByRequest(request);
    return await this.linkEntrepreneursAndStartups(entrepreneurs, targetIds);
  }

  async linkEntrepreneursAndStartups(ids: string[], startups: string[]) {
    // Find entrepreneurs by ids
    const entrepreneurs = await this.findMany(ids);

    // Link entrepreneurs to startups by given relationships
    const entrepreneursToLink = entrepreneurs.map((document) => {
      return { _id: document._id, item: document.item, rol: 'partner' };
    });
    const startupUpdateResult = await this.startupService.linkWithEntrepreneurs(
      startups,
      entrepreneursToLink,
    );

    if (!startupUpdateResult.acknowledged)
      throw new InternalServerErrorException(
        'Failed to create link between startups and entrepreneurs',
      );

    // Find entrepreneurs
    const startupDocuments = await this.startupService.findMany(startups);
    const startupRelationships = startupDocuments.map((document) => {
      return { _id: document._id, item: document.item };
    });
    const entrepreneurUpdateResult = await this.linkWithStartups(
      ids,
      startupRelationships,
    );
    return entrepreneurUpdateResult;
  }
}
