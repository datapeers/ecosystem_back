import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
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
import { AuthUser } from 'src/auth/types/auth-user';
import { DownloadRequestArgs } from 'src/shared/models/download-request.args';
import { DownloadResult } from 'src/shared/models/download-result';
import { excelUtilities } from 'src/shared/utilities/excel.utilities';
import { TableConfigService } from 'src/table/table-config/table-config.service';
import { DownloadsService } from 'src/downloads/downloads.service';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business.name) private readonly businessModel: Model<Business>,
    @Inject(forwardRef(() => EntrepreneurService))
    private readonly entrepreneurService: EntrepreneurService,
    private readonly tableConfigService: TableConfigService,
    private readonly downloadService: DownloadsService,
  ) {}

  /**
   * find doc business, is only intended to be used by websocket.
   */
  async getDocument(id: string) {
    const document = await this.findOne(id);
    return document;
  }

  /**
   * create doc business, is only intended to be used by websocket.
   */
  async createDocument(submission: any, context?: any) {
    const data = {
      item: submission,
    };
    const createdDocument = await this.create(data);
    if (context && context.entrepreneur) {
      const entrepreneur = context.entrepreneur;
      const linkResult = await this.linkBusinessesAndEntrepreneurs(
        [createdDocument._id],
        [entrepreneur],
      );
      if (!linkResult.acknowledged)
        throw new InternalServerErrorException(
          'Failed to link entrepreneur with business',
        );
    }
    return createdDocument;
  }

  /**
   * update doc business, is only intended to be used by websocket.
   */
  async updateDocument(id: string, submission: any, context: any) {
    const updatedDocument = await this.update(id, { item: submission });
    return updatedDocument;
  }

  /**
   * find all doc business.
   */
  async findAll(): Promise<Business[]> {
    const businesses = await this.businessModel.find({ deletedAt: null });
    return businesses;
  }

  /**
   * find many doc business by id
   */
  async findMany(ids: string[]): Promise<Business[]> {
    const businesses = await this.businessModel.find({
      _id: { $in: ids },
    });
    return businesses;
  }

  /**
   * find doc business paginated
   */
  async findManyPage(
    request: PageRequest,
    user: AuthUser,
    outputProjection?: any,
  ): Promise<PaginatedResult<Business>> {
    // TODO Implement filtering by user if required
    const options = new AggregateBuildOptions();
    if (outputProjection) {
      options.outputProjection = outputProjection;
    }
    const aggregationPipeline = requestUtilities.buildAggregationFromRequest(
      request,
      options,
    );
    const documents = await this.businessModel
      .aggregate(aggregationPipeline)
      .collation({ locale: 'en_US', strength: 2 });
    return documents[0];
  }

  /**
   * find doc business paginated by filters
   */
  async findManyIdsByRequest(request: PageRequest): Promise<string[]> {
    // TODO Implement filtering by user if required
    const options = new AggregateBuildOptions();
    options.paginated = false;
    options.outputProjection = { $project: { _id: 1 } };
    const aggregationPipeline = requestUtilities.buildAggregationFromRequest(
      request,
      options,
    );
    const documents = await this.businessModel
      .aggregate(aggregationPipeline)
      .collation({ locale: 'en_US', strength: 2 });
    return documents.map((doc) => doc._id);
  }

  /**
   * find doc business by id
   */
  async findOne(id: string): Promise<Business> {
    const business = await this.businessModel.findById(id);
    if (!business)
      throw new NotFoundException(`Couldn't find business with id ${id}`);
    return business;
  }

  /**
   * create doc business
   */
  async create(data: Partial<Business>): Promise<Business> {
    const createdBusiness = await this.businessModel.create(data);
    return createdBusiness;
  }

  /**
   * update doc business
   */
  async update(id: string, data: Partial<Business>): Promise<Business> {
    await this.businessModel.updateOne({ _id: id }, data, { new: true }).lean();
    return this.findOne(id);
  }

  /**
   * link list of business to entrepreneurs
   */
  async linkBusinessesAndEntrepreneurs(
    ids: string[],
    entrepreneurs: string[],
  ): Promise<UpdateResultPayload> {
    // Find businesses by ids
    const businesses = await this.findMany(ids);

    // Link entrepreneurs to businesses by given relationships
    const businessesToLink = businesses.map((document) => {
      return { _id: document._id, item: document.item };
    });
    const entrepreneurUpdateResult =
      await this.entrepreneurService.linkWithBusinesses(
        entrepreneurs,
        businessesToLink,
      );

    if (!entrepreneurUpdateResult.acknowledged)
      throw new InternalServerErrorException(
        'Failed to create link between businesses and entrepreneurs',
      );

    // Find entrepreneurs
    const entrepreneurDocuments =
      await this.entrepreneurService.findMany(entrepreneurs);
    const entrepreneurRelationships = entrepreneurDocuments.map((document) => {
      return { _id: document._id, item: document.item };
    });
    const businessUpdateResult = await this.linkWithEntrepreneurs(
      ids,
      entrepreneurRelationships,
    );
    return businessUpdateResult;
  }

  /**
   * only link list of entrepreneurs in business only by property
   */
  async linkWithEntrepreneurs(
    ids: string[],
    entrepreneurRelationships: EntrepreneurRelationship[],
  ): Promise<UpdateResultPayload> {
    return this.businessModel
      .updateMany(
        { _id: { $in: ids } },
        { $addToSet: { entrepreneurs: { $each: entrepreneurRelationships } } },
        { new: true },
      )
      .lean();
  }

  /**
   * search business request table and link entrepreneurs to that business
   */
  async linkWithEntrepreneursByRequest({
    request,
    targetIds,
  }: LinkWithTargetsByRequestArgs) {
    const businesses = await this.findManyIdsByRequest(request);
    return await this.linkBusinessesAndEntrepreneurs(businesses, targetIds);
  }

  /**
   * soft delete of many business
   */
  async delete(ids: string[]): Promise<UpdateResultPayload> {
    const updateResult = await this.businessModel.updateMany(
      { _id: { $in: ids.map((id) => new Types.ObjectId(id)) } },
      { deletedAt: Date.now() },
    );
    return {
      ...updateResult,
      upsertedId: updateResult.upsertedId?.toString(),
    };
  }

  /**
   * download table of business
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
    const data = (await excelUtilities.buildWorkbookBuffer(
      columns,
      rows,
      format,
    )) as Buffer;
    const fileUrl = await this.downloadService.uploadTempFile(data, format);
    return { url: fileUrl };
  }
}
