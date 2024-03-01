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
import { AuthUser } from 'src/auth/types/auth-user';
import { DownloadRequestArgs } from 'src/shared/models/download-request.args';
import { DownloadResult } from 'src/shared/models/download-result';
import { excelUtilities } from 'src/shared/utilities/excel.utilities';
import { DownloadsService } from 'src/downloads/downloads.service';
import { TableConfigService } from 'src/table/table-config/table-config.service';

/**
 * @ignore
 */
@Injectable()
export class InvestorService implements FormDocumentService<Investor> {
  constructor(
    @InjectModel(Investor.name) private readonly investorModel: Model<Investor>,
    private readonly tableConfigService: TableConfigService,
    private readonly downloadService: DownloadsService,
  ) {}

  async getDocument(id: string) {
    const document = await this.findOne(id);
    return document;
  }

  async createDocument(submission: any, context?: any) {
    const data = {
      item: submission,
    };
    const createdDocument = await this.create(data);
    return createdDocument;
  }

  async updateDocument(id: string, submission: any, context: any) {
    const updatedDocument = await this.update(id, { item: submission });
    return updatedDocument;
  }

  async findAll(): Promise<Investor[]> {
    const investors = await this.investorModel.find({ deletedAt: null });
    return investors;
  }

  async findManyPage(
    request: PageRequest,
    user: AuthUser,
    outputProjection?: any,
  ): Promise<PaginatedResult<Investor>> {
    // TODO Implement filtering by user if required
    const options = new AggregateBuildOptions();
    if (outputProjection) {
      options.outputProjection = outputProjection;
    }
    const aggregationPipeline = requestUtilities.buildAggregationFromRequest(
      request,
      options,
    );
    const documents = await this.investorModel
      .aggregate<PaginatedResult<Investor>>(aggregationPipeline)
      .collation({ locale: 'en_US', strength: 2 });
    return documents[0];
  }

  async findOne(id: string): Promise<Investor> {
    const investor = await this.investorModel.findById(id);
    if (!investor)
      throw new NotFoundException(`Couldn't find investor with id ${id}`);
    return investor;
  }

  async create(data: Partial<Investor>): Promise<Investor> {
    const createdInvestor = await this.investorModel.create(data);
    return createdInvestor;
  }

  async update(id: string, data: Partial<Investor>): Promise<Investor> {
    await this.investorModel.updateOne({ _id: id }, data, { new: true }).lean();
    return this.findOne(id);
  }

  async delete(ids: string[]): Promise<UpdateResultPayload> {
    const updateResult = await this.investorModel.updateMany(
      { _id: { $in: ids.map((id) => new Types.ObjectId(id)) } },
      { deletedAt: Date.now() },
    );
    return {
      ...updateResult,
      upsertedId: updateResult.upsertedId?.toString(),
    };
  }

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
}
