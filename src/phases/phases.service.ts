import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePhaseInput } from './dto/create-phase.input';
import { UpdatePhaseInput } from './dto/update-phase.input';
import { Phase } from './entities/phase.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthUser } from 'src/auth/types/auth-user';
import { ContentService } from 'src/content/content.service';
import { ActivitiesConfigService } from 'src/activities-config/activities-config.service';
import { ResourcesService } from '../resources/resources.service';
import * as moment from 'moment';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { ExpertService } from '../expert/expert.service';
import { StartupService } from 'src/startup/startup.service';
import { add, differenceInMilliseconds } from 'date-fns';

@Injectable()
export class PhasesService {
  constructor(
    @InjectModel(Phase.name) private readonly phaseModel: Model<Phase>,
    private readonly startupService: StartupService,
    private readonly expertService: ExpertService,
    private readonly contentService: ContentService,
    private readonly resourcesService: ResourcesService,
    private readonly activitiesConfigService: ActivitiesConfigService,
  ) {}

  async findAll(user: AuthUser): Promise<Phase[]> {
    switch (user.rolDoc.type) {
      case ValidRoles.expert:
        return this.getExpertBatchesAndPhases(user);
      case ValidRoles.host:
        return this.getHostBatchesAndPhases(user);
      case ValidRoles.teamCoach:
        return this.getTeamCoachBatchesAndHost(user);
      default:
        return await this.phaseModel.find({ isDeleted: false });
    }
  }

  async findList(ids: string[]) {
    const phaseBases = await this.phaseModel
      .find({ deleted: false, basePhase: true })
      .lean();
    const batches = await this.phaseModel
      .find({
        isDeleted: false,
        _id: { $in: ids.map((i) => new Types.ObjectId(i)) },
      })
      .lean();
    // console.log(phaseBases);
    return [...phaseBases, ...batches];
  }

  async find(ids: string[]): Promise<Phase[]> {
    const phases = await this.phaseModel.find({ isDeleted: false });
    return phases;
  }

  async findOne(id: string): Promise<Phase> {
    const phase = await this.phaseModel.findOne({ _id: id }).lean();
    if (!phase) throw new NotFoundException(`No phase found with id ${id}`);
    return phase;
  }

  async create(
    createPhaseInput: CreatePhaseInput,
    user: AuthUser,
  ): Promise<Phase> {
    if (createPhaseInput.childrenOf) {
      return await this.clone(createPhaseInput, user);
    } else {
      const createdPhase = await this.phaseModel.create({
        ...createPhaseInput,
        createdBy: user.uid,
      });
      return createdPhase;
    }
  }

  async clone(createPhaseInput: CreatePhaseInput, user: AuthUser) {
    const father = await this.findOne(createPhaseInput.childrenOf);
    delete father['_id'];
    delete father['name'];
    delete father['description'];
    delete father['startAt'];
    delete father['endAt'];
    delete createPhaseInput['stage'];
    delete createPhaseInput['landing'];
    delete createPhaseInput['thumbnail'];
    const createdBatch = await this.phaseModel.create({
      ...father,
      ...createPhaseInput,
      createdBy: user.uid,
    });
    await this.duplicateContent(createPhaseInput.childrenOf, createdBatch);
    await this.activitiesConfigService.duplicate(
      createPhaseInput.childrenOf,
      createdBatch._id.toString(),
    );
    return createdBatch;
  }

  async duplicateContent(phaseOld: string, phaseNew: Phase) {
    const docs = await this.contentService.findAll(phaseOld);
    const operationsContent = [];
    const operationsResources = [];
    let startDate = moment(phaseNew.startAt);
    for (const iterator of docs) {
      const newSprint = {
        ...iterator,
        _id: new Types.ObjectId(),
        phase: phaseNew._id,
        childs: [],
        resources: [],
      };
      if (newSprint.extra_options?.duration) {
        newSprint.extra_options['start'] = startDate.toDate();
        startDate = startDate.add(newSprint.extra_options?.duration, 'days');
        newSprint.extra_options['end'] = startDate.toDate();
        startDate = startDate.add(1, 'days');
        delete newSprint.extra_options['duration'];
      }
      const resourcesSprint = [];
      for (const resource of iterator.resources) {
        const newResource = {
          ...resource,
          _id: new Types.ObjectId(),
          phase: phaseNew._id,
          content: newSprint._id,
        };
        resourcesSprint.push(newResource._id);
        operationsResources.push(newResource);
      }
      newSprint.resources = resourcesSprint;
      const contentSprint = [];
      for (const content of iterator.childs) {
        const newContent = {
          ...content,
          _id: new Types.ObjectId(),
          phase: phaseNew._id,
          childs: [],
          resources: [],
        };
        const resourcesContent = [];
        for (const resource of content.resources) {
          const newResource = {
            ...resource,
            _id: new Types.ObjectId(),
            phase: phaseNew._id,
            content: newSprint._id,
          };
          resourcesContent.push(newResource._id);
          operationsResources.push(newResource);
        }
        newContent.resources = resourcesContent;
        contentSprint.push(newContent._id);
        operationsContent.push(newContent);
      }
      newSprint.childs = contentSprint;
      operationsContent.push(newSprint);
    }
    await this.contentService.createMany(operationsContent);
    await this.resourcesService.createMany(operationsResources);
    return true;
  }

  async update(id: string, updatePhaseInput: UpdatePhaseInput): Promise<Phase> {
    delete updatePhaseInput['_id'];
    const updatedPhase = await this.phaseModel
      .findOneAndUpdate({ _id: id }, { ...updatePhaseInput }, { new: true })
      .lean();
    return updatedPhase;
  }

  async remove(id: string) {
    const deletedPhase = await this.phaseModel.updateOne(
      { _id: id },
      { isDeleted: true },
      { new: true },
    );
    return deletedPhase;
  }

  async getExpertBatchesAndPhases(user: AuthUser) {
    const docExpert = await this.expertService.findByAccount(user.uid);
    const batchesExpert = await this.phaseModel
      .find({
        _id: { $in: docExpert.phases },
        isDeleted: false,
      })
      .lean();
    const phasesExpert = await this.phaseModel
      .find({
        _id: { $in: batchesExpert.map((i) => i.childrenOf) },
        isDeleted: false,
      })
      .lean();
    return [...phasesExpert, ...batchesExpert];
  }

  async getHostBatchesAndPhases(user: AuthUser) {
    if (!user.relationsAssign || Object.keys(user.relationsAssign).length === 0)
      return [];
    const batchesHost = await this.phaseModel
      .find({
        _id: {
          $in: user.relationsAssign?.batches?.map(
            (i) => new Types.ObjectId(i._id),
          ),
        },
        isDeleted: false,
      })
      .lean();
    const parentsBatches = await this.phaseModel
      .find({
        _id: {
          $in: batchesHost.map((i) => i.childrenOf),
        },
        isDeleted: false,
      })
      .lean();
    const listPhasesIds = user.relationsAssign.phases.map(
      (i) => new Types.ObjectId(i._id),
    );
    const phasesHost = await this.phaseModel
      .find({
        $or: [
          {
            _id: {
              $in: listPhasesIds,
            },
          },
          { childrenOf: { $in: listPhasesIds } },
        ],
        isDeleted: false,
      })
      .lean();

    const ansList = [...batchesHost, ...parentsBatches, ...phasesHost];
    const ids: Set<string> = new Set();
    const ans = [];
    for (const iterator of ansList) {
      if (ids.has(iterator._id.toString())) continue;
      ans.push(iterator);
      ids.add(iterator._id.toString());
    }
    return ans;
  }

  async getTeamCoachBatchesAndHost(user: AuthUser) {
    if (!user.relationsAssign || Object.keys(user.relationsAssign).length === 0)
      return [];
    const batches = await this.phaseModel
      .find({
        _id: {
          $in: user.relationsAssign?.batches?.map(
            (i) => new Types.ObjectId(i._id),
          ),
        },
        isDeleted: false,
      })
      .lean();
    const phases = await this.phaseModel
      .find({
        _id: {
          $in: batches.map((i) => new Types.ObjectId(i.childrenOf)),
        },
        isDeleted: false,
      })
      .lean();
    return [...phases, ...batches];
  }

  async getAllBatchesAccessHost(user: AuthUser): Promise<Types.ObjectId[]> {
    if (!user.relationsAssign || Object.keys(user.relationsAssign).length === 0)
      return [];
    const batchesHost = await this.phaseModel
      .find(
        {
          _id: {
            $in: user.relationsAssign?.batches?.map(
              (i) => new Types.ObjectId(i._id),
            ),
          },
          isDeleted: false,
        },
        { _id: 1 },
      )
      .lean();
    const parentsBatches = await this.phaseModel
      .find(
        {
          _id: {
            $in: batchesHost.map((i) => i.childrenOf),
          },
          isDeleted: false,
        },
        { _id: 1 },
      )
      .lean();
    const listPhasesIds = user.relationsAssign.phases.map(
      (i) => new Types.ObjectId(i._id),
    );
    const phasesHost = await this.phaseModel
      .find(
        {
          $or: [
            {
              _id: {
                $in: listPhasesIds,
              },
            },
            { childrenOf: { $in: listPhasesIds } },
          ],
          isDeleted: false,
        },
        { _id: 1 },
      )
      .lean();

    const ansList = [...batchesHost, ...parentsBatches, ...phasesHost];
    const ids: Set<string> = new Set();
    const ans = [];
    for (const iterator of ansList) {
      if (ids.has(iterator._id.toString())) continue;
      ans.push(iterator._id);
      ids.add(iterator._id.toString());
    }
    return ans;
  }

  async calcEndDate(phase: Phase) {
    if (phase.basePhase) return new Date(phase.endAt);
    const docs = await this.contentService.findAll(phase._id.toString());
    const lastSprint = docs[docs.length - 1];
    return moment(lastSprint.extra_options.end).add(1, 'days').toDate();
  }
}
