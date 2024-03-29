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
    $addFields: { isProspect: { $eq: [{ $size: '$phases' }, 0] } },
  };

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
    const experts = await this.expertModel.find({ deletedAt: null });
    return experts;
  }

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

  async findByStartup(startupID: string) {
    return await this.expertModel
      .find({ 'phases.startUps._id': startupID })
      .lean();
  }

  async findByAccount(accountId: string) {
    return await this.expertModel.findOne({ accountId }).lean();
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
    delete data['_id'];
    const updatedExpert = await this.expertModel.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true, lean: true },
    );
    return updatedExpert;
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

  async downloadByRequest(
    { request, configId, format }: DownloadRequestArgs,
    user: AuthUser,
  ): Promise<DownloadResult> {
    const config = await this.tableConfigService.findOne(configId);
    const tableColumns = config.columns;
    const outputProjection =
      requestUtilities.getProjectionFromConfigTable(tableColumns);
    const pageResult = await this.findManyPage(request, user, outputProjection);
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
}
