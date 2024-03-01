import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FormDocumentService } from 'src/forms/factories/form-document-service';
import { Expert } from './entities/expert.entity';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { LinkExpertsToPhaseArgs } from './args/link-phase-expert.args';
import { LinkStartupsExpertsArgs } from './args/link-phase-startups-expert.args';
import { AggregateBuildOptions } from 'src/shared/models/aggregate-build-options';
import { PageRequest } from 'src/shared/models/page-request';
import { PaginatedResult } from 'src/shared/models/paginated-result';
import { requestUtilities } from 'src/shared/utilities/request.utilities';
import { DownloadsService } from 'src/downloads/downloads.service';
import { TableConfigService } from 'src/table/table-config/table-config.service';
import { AuthUser } from 'src/auth/types/auth-user';
import { DownloadRequestArgs } from 'src/shared/models/download-request.args';
import { DownloadResult } from 'src/shared/models/download-result';
import { excelUtilities } from 'src/shared/utilities/excel.utilities';

@Injectable()
export class ExpertService implements FormDocumentService {
  constructor(
    @InjectModel(Expert.name) private readonly expertModel: Model<Expert>,
    private readonly tableConfigService: TableConfigService,
    private readonly downloadService: DownloadsService,
  ) {}

  private static readonly virtualFields = {
    // $addFields: { isProspect: { $eq: [{ $size: '$phases' }, 0] } },
    $addFields: {
      isProspect: {
        $cond: {
          if: { $eq: [{ $size: '$phases' }, 0] },
          then: true,
          else: false,
        },
      },
    },
  };

  /**
   * find expert doc, is only intended to be used by websocket.
   */
  async getDocument(id: string) {
    const document = await this.findOne(id);
    return document;
  }

  /**
   * create expert doc, is only intended to be used by websocket.
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
   * update expert doc, is only intended to be used by websocket.
   */
  async updateDocument(id: string, submission: any, context: any) {
    const updatedDocument = await this.update(id, { item: submission });
    return updatedDocument;
  }

  /**
   * find all expert docs
   */
  async findAll(): Promise<Expert[]> {
    const experts = await this.expertModel.find({
      $or: [
        { deletedAt: { $ne: undefined } },
        { phases: { $exists: true, $not: { $size: 0 } } },
      ],
    });
    return experts;
  }

  /**
   * find expert doc by table request
   */
  async findManyPage(
    request: PageRequest,
    user: AuthUser,
    outputProjection?: any,
  ): Promise<PaginatedResult<Expert>> {
    // TODO Implement filtering by user if required
    const options = new AggregateBuildOptions();
    if (outputProjection) {
      options.outputProjection = outputProjection;
    }
    options.virtualFields = ExpertService.virtualFields;
    const aggregationPipeline = requestUtilities.buildAggregationFromRequest(
      request,
      options,
    );
    const documents = await this.expertModel
      .aggregate<PaginatedResult<Expert>>(aggregationPipeline)
      .collation({ locale: 'en_US', strength: 2 });
    return documents[0];
  }

  /**
   * find experts docs by batch
   */
  async findByPhase(phase: string): Promise<Expert[]> {
    const initMatch = {
      deletedAt: null,
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

    return experts.map((i) => {
      return { ...i, phases: i.phases.filter((doc) => doc._id === phase) };
    });
  }

  /**
   * find expert assigned to startups
   */
  async findByStartup(startupID: string) {
    return await this.expertModel
      .find({ 'phases.startUps._id': startupID })
      .lean();
  }

  /**
   * find expert doc by account
   */
  async findByAccount(accountId: string) {
    return await this.expertModel.findOne({ accountId }).lean();
  }

  /**
   * find expert by id
   */
  async findOne(id: string): Promise<Expert> {
    const expert = await this.expertModel.findById(id);
    if (!expert)
      throw new NotFoundException(`Couldn't find expert with id ${id}`);
    return expert;
  }

  /**
   * create expert
   */
  async create(data: Partial<Expert>): Promise<Expert> {
    const createdExpert = await this.expertModel.create(data);
    return createdExpert;
  }

  /**
   * update expert
   */
  async update(id: string, data: Partial<Expert>): Promise<Expert> {
    delete data['_id'];
    const updatedExpert = await this.expertModel.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true, lean: true },
    );
    return updatedExpert;
  }

  /**
   * soft delete expert list
   */
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

  /**
   * link expert to a batch
   */
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

  /**
   * unlink expert to a batch
   */
  async unlinkWithPhase(
    linkExpertsToPhaseArgs: LinkExpertsToPhaseArgs,
  ): Promise<UpdateResultPayload> {
    return this.expertModel
      .updateMany(
        { _id: { $in: linkExpertsToPhaseArgs.experts } },
        { $pull: { phases: { _id: linkExpertsToPhaseArgs.phaseId } } },
        { new: true },
      )
      .lean();
  }

  /**
   * link startups to expert
   */
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

  /**
   * download table of expert
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
   * assign new account an expert doc
   */
  async assignAccountAndLinkBatch(
    accountId: string,
    linkExpertsToPhaseArgs: LinkExpertsToPhaseArgs,
  ) {
    console.log(accountId);
    const phaseRelationship = {
      _id: linkExpertsToPhaseArgs.phaseId,
      name: linkExpertsToPhaseArgs.name,
      startUps: [],
    };
    return this.expertModel
      .updateOne(
        { _id: { $in: linkExpertsToPhaseArgs.experts } },
        { $addToSet: { phases: { $each: [phaseRelationship] } }, accountId },
        { new: true },
      )
      .lean();
  }

  /**
   * find list of expert
   */
  async findMany(ids: string[]) {
    if (!ids.length) return [];
    const experts = await this.expertModel
      .find({
        _id: { $in: ids },
        deletedAt: null,
      })
      .lean();
    return experts;
  }
}
