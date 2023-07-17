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

@Injectable()
export class StartupService implements FormDocumentService<Startup> {
  constructor(
    @InjectModel(Startup.name) private readonly startupModel: Model<Startup>,
    @Inject(forwardRef(() => EntrepreneurService))
    private readonly entrepreneurService: EntrepreneurService,
    private readonly expertService: ExpertService,
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
  ): Promise<PaginatedResult<Startup>> {
    const options = new AggregateBuildOptions();
    options.virtualFields = StartupService.virtualFields;
    const aggregationPipeline = requestUtilities.buildAggregationFromRequest(
      request,
      options,
    );
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
    const documents = await this.startupModel
      .aggregate(aggregationPipeline)
      .collation({ locale: 'en_US', strength: 2 });
    return documents[0];
  }

  async findManyIdsByRequest(request: PageRequest): Promise<string[]> {
    const options = new AggregateBuildOptions();
    options.virtualFields = StartupService.virtualFields;
    options.paginated = false;
    options.outputProjection = { $project: { _id: 1 } };
    const aggregationPipeline = requestUtilities.buildAggregationFromRequest(
      request,
      options,
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
      return { _id: startup._id, item: startup.item };
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
    const entrepreneurDocuments = await this.entrepreneurService.findMany(
      entrepreneurs,
    );
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

  async findByPhase(phase: string, user: AuthUser): Promise<Startup[]> {
    const initMatch = {
      'phases._id': phase,
    };
    if (user.rolDoc.type === ValidRoles.expert) {
      const docExpert = await this.expertService.findByAccount(user.uid);
      const phaseProfileExpert = docExpert.phases.find((i) => i._id === phase);
      let startUpsExpert = phaseProfileExpert.startUps.map(
        (i) => new Types.ObjectId(i._id),
      );
      initMatch['_id'] = { $in: startUpsExpert };
    }
    if (user.rolDoc.type === ValidRoles.teamCoach) {
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
    const createdStartup = await this.startupModel
      .updateOne({ _id: id }, data, { new: true })
      .lean();
    return createdStartup;
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
    return this.startupModel
      .updateMany(
        { _id: { $in: linkStartUpsToPhaseArgs.startups } },
        { $addToSet: { phases: { $each: [phaseRelationship] } } },
        { new: true },
      )
      .lean();
  }

  async linkWithEntrepreneursByRequest({
    request,
    targetIds,
  }: LinkWithTargetsByRequestArgs) {
    const businesses = await this.findManyIdsByRequest(request);
    return await this.linkStartupsAndEntrepreneurs(businesses, targetIds);
  }
}
