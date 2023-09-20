import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import {
  EntrepreneurRelationship,
  PhaseRelationship,
  Startup,
} from './entities/startup.entity';
import { FormDocumentService } from 'src/forms/factories/form-document-service';
import { EntrepreneurService } from 'src/entrepreneur/entrepreneur.service';
import { LinkStartupToPhaseArgs } from './args/link-phase-startup.args';
import { forwardRef } from '@nestjs/common';
import { LinkWithTargetsByRequestArgs } from 'src/shared/args/link-with-targets-by-request.args';
import { AggregateBuildOptions } from 'src/shared/models/aggregate-build-options';
import { PageRequest } from 'src/shared/models/page-request';
import { PaginatedResult } from 'src/shared/models/paginated-result';
import { requestUtilities } from 'src/shared/utilities/request.utilities';
import { AuthUser } from 'src/auth/types/auth-user';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { ExpertService } from '../expert/expert.service';
import { Expert } from 'src/expert/entities/expert.entity';
import { Permission, getPermissionList } from 'src/auth/enums/permissions.enum';
import { DownloadRequestArgs } from 'src/shared/models/download-request.args';
import { DownloadResult } from 'src/shared/models/download-result';
import { excelUtilities } from 'src/shared/utilities/excel.utilities';
import { DownloadsService } from 'src/downloads/downloads.service';
import { TableConfigService } from 'src/table/table-config/table-config.service';
import { StartupRelationship } from 'src/entrepreneur/entities/entrepreneur.entity';

@Injectable()
export class StartupService implements FormDocumentService<Startup> {
  constructor(
    @InjectModel(Startup.name) private readonly startupModel: Model<Startup>,
    @Inject(forwardRef(() => EntrepreneurService))
    private readonly entrepreneurService: EntrepreneurService,
    @Inject(forwardRef(() => ExpertService))
    private readonly expertService: ExpertService,
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
    };
    const createdDocument = await this.create(data);
    if (context && context.entrepreneur) {
      const entrepreneur = context.entrepreneur;
      const linkResult = await this.linkStartupsAndEntrepreneurs(
        [createdDocument._id],
        [entrepreneur],
      );
      if (!linkResult.acknowledged)
        throw new InternalServerErrorException(
          'Failed to link entrepreneur with startup',
        );
    }
    return createdDocument;
  }

  async findManyPage(
    request: PageRequest,
    user: AuthUser,
    outputProjection?: any,
  ): Promise<PaginatedResult<Startup>> {
    const options = new AggregateBuildOptions();
    if (outputProjection) {
      options.outputProjection = outputProjection;
    }
    options.virtualFields = StartupService.virtualFields;
    let aggregationPipeline = requestUtilities.buildAggregationFromRequest(
      request,
      options,
    );
    aggregationPipeline = await this.updatePipelineForUser(
      aggregationPipeline,
      user,
    );
    const documents = await this.startupModel
      .aggregate(aggregationPipeline)
      .collation({ locale: 'en_US', strength: 2 });
    return documents[0];
  }

  async updatePipelineForUser(aggregationPipeline: any, user: AuthUser) {
    if (
      user.rolDoc.type === ValidRoles.expert &&
      !getPermissionList(user).includes(Permission.load_all_startups)
    ) {
      const docExpert = await this.expertService.findByAccount(user.uid);
      const idStartups = docExpert.phases.flatMap((phaseProfile) =>
        phaseProfile.startUps.map((startup) => new Types.ObjectId(startup._id)),
      );
      aggregationPipeline[0]['$match']['_id'] = { $in: idStartups };
    }
    if (
      user.rolDoc.type === ValidRoles.teamCoach &&
      !getPermissionList(user).includes(Permission.load_all_startups)
    ) {
      let startupsTeamCoach =
        user.relationsAssign?.startups.map((i) => new Types.ObjectId(i._id)) ??
        [];
      aggregationPipeline[0]['$match']['_id'] = { $in: startupsTeamCoach };
    }
    return aggregationPipeline;
  }

  async findManyIdsByRequest(
    request: PageRequest,
    user: AuthUser,
  ): Promise<string[]> {
    const options = new AggregateBuildOptions();
    options.virtualFields = StartupService.virtualFields;
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
    const documents = await this.startupModel
      .aggregate(aggregationPipeline)
      .collation({ locale: 'en_US', strength: 2 });
    return documents.map((doc) => doc._id);
  }

  async linkStartupsAndEntrepreneurs(
    ids: string[],
    entrepreneurs: string[],
  ): Promise<UpdateResultPayload> {
    // Find bussinesses by ids
    const startups = await this.findMany(ids);

    // Link entrepreneurs to bussinesses by given relationships
    const startupsToLink = startups.map((startup) => {
      return { _id: startup._id, item: startup.item, phases: startup.phases };
    });
    const entrepreneurUpdateResult =
      await this.entrepreneurService.linkWithStartups(
        entrepreneurs,
        startupsToLink,
      );

    if (!entrepreneurUpdateResult.acknowledged)
      throw new InternalServerErrorException(
        'Failed to create link between startups and entrepreneurs',
      );

    // Find entrepreneurs
    const entrepreneurDocuments =
      await this.entrepreneurService.findMany(entrepreneurs);
    const entrepreneurRelationships = entrepreneurDocuments.map((document) => {
      return { _id: document._id, item: document.item, rol: 'partner' };
    });
    const startupUpdateResult = await this.linkWithEntrepreneurs(
      ids,
      entrepreneurRelationships,
    );
    return startupUpdateResult;
  }

  async linkWithEntrepreneurs(
    ids: string[],
    entrepreneurRelationships: EntrepreneurRelationship[],
  ): Promise<UpdateResultPayload> {
    return this.startupModel
      .updateMany(
        { _id: { $in: ids } },
        { $addToSet: { entrepreneurs: { $each: entrepreneurRelationships } } },
        { new: true },
      )
      .lean();
  }

  async updateDocument(id: string, submission: any, context: any) {
    const updatedDocument = await this.update(id, { item: submission });
    return updatedDocument;
  }

  async findAll(): Promise<Startup[]> {
    const startups = await this.startupModel.find({ deletedAt: null });
    return startups;
  }

  async findByEntrepreneur(idEntrepreneur: string): Promise<Startup[]> {
    const startup = await this.startupModel
      .find({
        deletedAt: null,
        'entrepreneurs._id': new Types.ObjectId(idEntrepreneur),
      })
      .lean();
    return startup;
  }

  async findLikeCommunity(): Promise<Startup[]> {
    const startups = await this.startupModel.aggregate([
      {
        $addFields: {
          leaderEntrepreneurs: {
            $filter: {
              input: '$entrepreneurs',
              as: 'entrepreneur',
              cond: { $eq: ['$$entrepreneur.rol', 'leader'] },
            },
          },
        },
      },
      {
        $match: {
          leaderEntrepreneurs: { $size: 1 },
        },
      },
    ]);

    return startups.map((i) => {
      return { ...i, entrepreneurs: i.leaderEntrepreneurs };
    });
  }

  async findByPhase(phase: string, user?: AuthUser): Promise<Startup[]> {
    const initMatch = {
      'phases._id': phase,
      deletedAt: null,
    };
    if (user?.rolDoc?.type === ValidRoles.expert) {
      const docExpert = await this.expertService.findByAccount(user.uid);
      const phaseProfileExpert = docExpert.phases.find((i) => i._id === phase);
      let startUpsExpert = phaseProfileExpert.startUps.map(
        (i) => new Types.ObjectId(i._id),
      );
      initMatch['_id'] = { $in: startUpsExpert };
    }
    if (user?.rolDoc?.type === ValidRoles.teamCoach) {
      let startupsTeamCoach =
        user.relationsAssign?.startups.map((i) => new Types.ObjectId(i._id)) ??
        [];
      initMatch['_id'] = { $in: startupsTeamCoach };
    }
    const lookUps = [
      // {
      //   $lookup: {
      //     from: Expert.name,
      //     let: { startupId: '$_id' },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $in: ['$$startupId', '$phases.startUps._id'],
      //           },
      //         },
      //       },
      //       {
      //         $project: {
      //           item: 1,
      //         },
      //       },
      //     ],
      //     as: 'experto',
      //   },
      // },
      // {
      //   $unwind: {
      //     path: '$experto',
      //     preserveNullAndEmptyArrays: true,
      //   },
      // },
    ];
    const project = {
      $project: {
        _id: 1,
        item: 1,
        phases: 1,
        entrepreneurs: 1,
        // experto: {
        //   $cond: {
        //     if: { $ne: ['$experto', null] },
        //     then: '$experto.item.nombre',
        //     else: null,
        //   },
        // },
      },
    };
    const startups = await this.startupModel.aggregate([
      { $match: initMatch },
      project,
      ...lookUps,
    ]);
    return startups;
  }

  async findMany(ids: string[]): Promise<Startup[]> {
    const startups = await this.startupModel.find({
      _id: { $in: ids },
    });
    return startups;
  }

  async findOne(id: string): Promise<Startup> {
    const startup = await this.startupModel.findById(id);
    if (!startup)
      throw new NotFoundException(`Couldn't find startup with id ${id}`);
    return startup;
  }

  async create(data: Partial<Startup>): Promise<Startup> {
    const createdStartup = await this.startupModel.create(data);
    return createdStartup;
  }

  async update(id: string, data: Partial<Startup>): Promise<Startup> {
    await this.startupModel.updateOne({ _id: id }, data, { new: true }).lean();
    return this.findOne(id);
  }

  async delete(ids: string[]): Promise<UpdateResultPayload> {
    const updateResult = await this.startupModel.updateMany(
      { _id: { $in: ids.map((id) => new Types.ObjectId(id)) } },
      { deletedAt: Date.now() },
    );
    return {
      ...updateResult,
      upsertedId: updateResult.upsertedId?.toString(),
    };
  }

  async linkWithPhase(
    linkStartUpsToPhaseArgs: LinkStartupToPhaseArgs,
  ): Promise<UpdateResultPayload> {
    const phaseRelationship: PhaseRelationship = {
      _id: linkStartUpsToPhaseArgs.phaseId,
      name: linkStartUpsToPhaseArgs.name,
    };
    const startups = linkStartUpsToPhaseArgs.startups;
    const updateResult = await this.startupModel.updateMany(
      { _id: { $in: startups } },
      { $addToSet: { phases: { $each: [phaseRelationship] } } },
      { new: true },
    );
    if (updateResult.acknowledged) {
      const updatedStartupsRelationships =
        await this.getStartupsRelationships(startups);
      await this.entrepreneurService.updatePhasesForStartupsRelationships(
        updatedStartupsRelationships,
      );
    }
    return UpdateResultPayload.fromPayload(updateResult);
  }

  async getStartupsRelationships(
    ids: string[],
  ): Promise<StartupRelationship[]> {
    return await this.startupModel.find(
      { _id: { $in: ids } },
      { _id: 1, item: 1, phases: 1 },
    );
  }

  async linkWithEntrepreneursByRequest(
    { request, targetIds }: LinkWithTargetsByRequestArgs,
    user: AuthUser,
  ) {
    const businesses = await this.findManyIdsByRequest(request, user);
    return await this.linkStartupsAndEntrepreneurs(businesses, targetIds);
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
