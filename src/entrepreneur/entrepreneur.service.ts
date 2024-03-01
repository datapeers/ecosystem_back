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
import { Permission, getPermissionList } from 'src/auth/enums/permissions.enum';
import { DownloadRequestArgs } from 'src/shared/models/download-request.args';
import { TableConfigService } from 'src/table/table-config/table-config.service';
import { excelUtilities } from 'src/shared/utilities/excel.utilities';
import { DownloadsService } from 'src/downloads/downloads.service';
import { DownloadResult } from 'src/shared/models/download-result';

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
    private readonly tableConfigService: TableConfigService,
    private readonly downloadService: DownloadsService,
  ) {}

  private static readonly virtualFields = {
    $addFields: {
      isProspect: {
        $not: {
          $anyElementTrue: {
            $map: {
              input: '$startups',
              as: 'startup',
              in: {
                $gt: [{ $size: { $ifNull: ['$$startup.phases', []] } }, 0],
              },
            },
          },
        },
      },
    },
  };

  // async onModuleInit() {
  //   let startups = await this.entrepreneurModel.find({});
  //   for (const iterator of startups) {
  //     iterator.startups = iterator.startups.map((i) => {
  //       return { ...i, state: 'member' };
  //     });
  //     await iterator.save();
  //   }
  // }

  /**
   * find doc entrepreneur, is only intended to be used by websocket.
   */
  async getDocument(id: string) {
    const document = await this.findOne(id);
    return document;
  }

  /**
   * create doc entrepreneur, is only intended to be used by websocket.
   */
  async createDocument(submission: any, context?: any) {
    const data = {
      item: submission,
      ...context,
    };
    const createdDocument = await this.create(data);
    return createdDocument;
  }

  /**
   * update doc entrepreneur, is only intended to be used by websocket.
   */
  async updateDocument(id: string, submission: any, context: any) {
    const updatedDocument = await this.update(id, { item: submission });
    return updatedDocument;
  }

  /**
   * find all entrepreneur docs
   */
  async findAll(): Promise<Entrepreneur[]> {
    const entrepreneurs = await this.entrepreneurModel.find({
      deletedAt: null,
    });
    return entrepreneurs;
  }

  /**
   * find doc entrepreneur paginated
   */
  async findManyPage(
    request: PageRequest,
    user: AuthUser,
    outputProjection?: any,
  ): Promise<PaginatedResult<Entrepreneur>> {
    const options = new AggregateBuildOptions();
    options.virtualFields = EntrepreneurService.virtualFields;
    if (outputProjection) {
      options.outputProjection = outputProjection;
    }
    let aggregationPipeline = requestUtilities.buildAggregationFromRequest(
      request,
      options,
    );
    aggregationPipeline = await this.updatePipelineForUser(
      aggregationPipeline,
      user,
    );
    // filtro personas
    aggregationPipeline[1]['$addFields']['members'] = {
      $filter: {
        input: '$startups',
        as: 'startup',
        cond: { $eq: ['$$startup.state', 'member'] },
      },
    };
    // Divide el array en dos partes en la posición deseada
    let primeraParte = aggregationPipeline.slice(0, 2);
    let segundaParte = aggregationPipeline.slice(2);

    // Combina las dos partes con el nuevo elemento en el medio
    // const miArray = [
    //   ...primeraParte,
    //   { $match: { members: { $size: 1 } } },
    //   ...segundaParte,
    // ];
    // aggregationPipeline[2];

    const documents = await this.entrepreneurModel
      .aggregate(aggregationPipeline)
      .collation({ locale: 'en_US', strength: 2 });
    documents[0].documents = documents[0].documents.map((i) => {
      return { ...i, startups: i['members'] };
    });
    return documents[0];
  }

  /**
   * find doc entrepreneur paginated filtered
   */
  async findManyIdsByRequest(
    request: PageRequest,
    user: AuthUser,
  ): Promise<string[]> {
    const options = new AggregateBuildOptions();
    options.virtualFields = EntrepreneurService.virtualFields;
    options.paginated = false;
    options.outputProjection = { $project: { _id: 1 } };
    let aggregationPipeline = requestUtilities.buildAggregationFromRequest(
      request,
      options,
    );
    aggregationPipeline = await this.updatePipelineForUser(
      aggregationPipeline,
      user,
    );
    const documents = await this.entrepreneurModel
      .aggregate<Entrepreneur>(aggregationPipeline)
      .collation({ locale: 'en_US', strength: 2 });
    return documents.map((doc) => doc._id);
  }

  /**
   * filters in table requests according to user role
   */
  async updatePipelineForUser(aggregationPipeline: any, user: AuthUser) {
    if (
      user.rolDoc.type === ValidRoles.expert &&
      !getPermissionList(user).includes(Permission.load_all_entrepreneurs)
    ) {
      const docExpert = await this.expertService.findByAccount(user.uid);
      const idStartups = docExpert.phases.flatMap((phaseProfile) =>
        phaseProfile.startUps.map((startup) => new Types.ObjectId(startup._id)),
      );
      aggregationPipeline[0]['$match']['startups._id'] = { $in: idStartups };
    }
    if (
      user.rolDoc.type === ValidRoles.teamCoach &&
      !getPermissionList(user).includes(Permission.load_all_entrepreneurs)
    ) {
      let startupsTeamCoach =
        user.relationsAssign?.startups.map((i) => new Types.ObjectId(i._id)) ??
        [];
      aggregationPipeline[0]['$match']['startups._id'] = {
        $in: startupsTeamCoach,
      };
    }
    return aggregationPipeline;
  }

  /**
   * find many entrepreneurs by ids
   */
  async findMany(ids: string[]) {
    if (!ids.length) return [];
    const entrepreneurs = await this.entrepreneurModel.find({
      _id: { $in: ids },
      deletedAt: null,
    });
    return entrepreneurs;
  }

  /**
   * find entrepreneur by id
   */
  async findOne(id: string): Promise<Entrepreneur> {
    const entrepreneur = await this.entrepreneurModel.findOne({
      _id: id,
    });
    if (!entrepreneur)
      throw new NotFoundException(`Couldn't find entrepreneur with id ${id}`);
    return entrepreneur;
  }

  /**
   * find entrepreneurs by uid account
   */
  async findByAccount(accountId: string) {
    return await this.entrepreneurModel.findOne({ accountId }).lean();
  }

  /**
   * create entrepreneur doc
   */
  async create(data: Partial<Entrepreneur>): Promise<Entrepreneur> {
    const createdEntrepreneur = await this.entrepreneurModel.create(data);
    return createdEntrepreneur;
  }

  /**
   * update entrepreneur doc
   */
  async update(id: string, data: Partial<Entrepreneur>): Promise<Entrepreneur> {
    await this.entrepreneurModel
      .updateOne({ _id: id }, data, { new: true })
      .lean();
    return this.findOne(id);
  }

  /**
   * link list of entrepreneur to business and marked leaved the other startup links
   */
  async linkWithStartups(
    ids: string[],
    startupsRelationships: StartupRelationship[],
  ): Promise<UpdateResultPayload> {
    const filter = { _id: { $in: ids } };
    // Actualizar el estado de las startups existentes
    const setUpdate = {
      $set: { 'startups.$[elem].state': 'leaved' },
    };
    const arrayFilters = [{ 'elem.state': { $ne: 'leaved' } }];
    await this.entrepreneurModel
      .updateMany(filter, setUpdate, {
        arrayFilters,
      })
      .lean();
    // Agregar la nueva startup
    const addToSetUpdate = {
      $addToSet: { startups: { $each: startupsRelationships } },
    };
    return await this.entrepreneurModel
      .updateMany(filter, addToSetUpdate, { new: true })
      .lean();
  }

  /**
   * soft delete of many entrepreneurs
   */
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

  /**
   * link list of entrepreneur to business in two ways by table
   */
  async linkWithBusinessesByRequest(
    { request, targetIds }: LinkWithTargetsByRequestArgs,
    user: AuthUser,
  ) {
    const entrepreneurs = await this.findManyIdsByRequest(request, user);
    return await this.linkEntrepreneursAndBusinesses(entrepreneurs, targetIds);
  }

  /**
   * link list of entrepreneur to business in two ways
   */
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

  async linkWithStartupsByRequest(
    { request, targetIds }: LinkWithTargetsByRequestArgs,
    user: AuthUser,
  ) {
    const entrepreneurs = await this.findManyIdsByRequest(request, user);
    return await this.linkEntrepreneursAndStartups(entrepreneurs, targetIds);
  }

  async linkEntrepreneursAndStartups(ids: string[], startups: string[]) {
    // Find entrepreneurs by ids
    const entrepreneurs = await this.findMany(ids);

    // Link entrepreneurs to startups by given relationships
    const entrepreneursToLink = [];
    for (const entrepreneurDoc of entrepreneurs) {
      const entrepreneurLink = {
        _id: entrepreneurDoc._id,
        item: entrepreneurDoc.item,
        rol: 'partner',
        description: '',
        state: 'member',
      };
      entrepreneursToLink.push(entrepreneurLink);
      const lastStartup = entrepreneurDoc.startups.find(
        (i) => i.state === 'member',
      );
      if (!lastStartup) continue;
      await this.startupService.unlinkEntrepreneur(
        lastStartup._id,
        entrepreneurDoc._id,
      );
    }
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
      return {
        _id: document._id,
        item: document.item,
        phases: document.phases,
        state: 'member',
      };
    });
    const entrepreneurUpdateResult = await this.linkWithStartups(
      ids,
      startupRelationships,
    );

    return entrepreneurUpdateResult;
  }

  /**
   * link list of entrepreneur to business only by property
   */
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

  /**
   * download table of entrepreneurs
   */
  async downloadByRequest(
    { request, configId, format }: DownloadRequestArgs,
    user: AuthUser,
  ): Promise<DownloadResult> {
    const config = await this.tableConfigService.findOne(configId);
    const tableColumns = config.columns;
    const outputProjection =
      requestUtilities.getProjectionFromConfigTable(tableColumns);
    const pageResult = await this.findManyPage(
      { ...request, skip: 0, limit: 10000 },
      user,
      outputProjection,
    );
    const rows = excelUtilities.parseDocumentsToRows(
      pageResult.documents,
      tableColumns,
    );
    const columns = tableColumns.map((col) => {
      return { header: col.label, width: col.label.length + 3 };
    });
    const data = await excelUtilities.buildWorkbookBuffer(
      columns,
      rows,
      format,
    );
    const fileUrl = await this.downloadService.uploadTempFile(data, format);
    return { url: fileUrl };
  }

  /**
   * update states of startups entrepreneurs linked to a batch
   */
  async updatePhasesForStartupsRelationships(
    relationships: StartupRelationship[],
  ) {
    // Initialize the bulk operations array
    const bulkOperations = [];

    // Iterate through the arrayOfStartupsWithNewPhases
    relationships.forEach((startup) => {
      // Update operation for each startup
      const updateOperation = {
        updateMany: {
          filter: { 'startups._id': startup._id }, // Match documents that have the startup in their startups array
          update: {
            $set: {
              'startups.$.phases': startup.phases, // Update the phases array for the matched startup
            },
          },
        },
      };
      // Add the update operation to the bulkOperations array
      bulkOperations.push(updateOperation);
    });

    // Execute the bulkWrite operation to update all entrepreneurs
    const bulkWriteResult =
      await this.entrepreneurModel.bulkWrite(bulkOperations);
    if (!bulkWriteResult.ok) {
      throw new InternalServerErrorException(
        'Failed to update phases for startups relationship in entrepreneurs documents',
      );
    }
    return bulkWriteResult;
  }

  /**
   * update states of startups entrepreneurs linked to a batch to leaved
   */
  unlinkStartup(entrepreneurId, startupId) {
    return this.entrepreneurModel.updateOne(
      { _id: entrepreneurId, 'startups._id': startupId },
      { $set: { 'startups.$.state': 'leaved' } },
    );
  }
}
