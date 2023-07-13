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
@Injectable()
export class PhasesService {
  constructor(
    @InjectModel(Phase.name) private readonly phaseModel: Model<Phase>,
    private readonly expertService: ExpertService,
    private readonly contentService: ContentService,
    private readonly resourcesService: ResourcesService,
    private readonly activitiesConfigService: ActivitiesConfigService,
  ) {}

  async findAll(user: AuthUser): Promise<Phase[]> {
    switch (user.rolDoc.type) {
      case ValidRoles.expert:
        const docExpert = await this.expertService.findByAccount(user.uid);
        const batchesExpert = await this.phaseModel
          .find({
            _id: { $in: docExpert.phases },
            deleted: false,
          })
          .lean();
        const phasesExpert = await this.phaseModel
          .find({
            _id: { $in: batchesExpert.map((i) => i.childrenOf) },
            deleted: false,
          })
          .lean();
        return [...phasesExpert, ...batchesExpert];
      case ValidRoles.host:
        if (
          !user.relationsAssign ||
          Object.keys(user.relationsAssign).length === 0
        )
          return [];
        const batchesHost = await this.phaseModel
          .find({
            _id: {
              $in: user.relationsAssign?.batches?.map(
                (i) => new Types.ObjectId(i._id),
              ),
            },
            deleted: false,
          })
          .lean();
        const idsPhases: Set<string> = new Set();
        for (const iterator of batchesHost) {
          idsPhases.add(iterator.childrenOf);
        }
        for (const iterator of user.relationsAssign.phases) {
          idsPhases.add(iterator._id);
        }
        let arrayOfIds = Array.from(idsPhases);
        const phasesHost = await this.phaseModel
          .find({
            $or: [
              { _id: { $in: arrayOfIds.map((i) => new Types.ObjectId(i)) } },
              { childrenOf: { $in: arrayOfIds } },
            ],
            deleted: false,
          })
          .lean();
        return [...phasesHost, ...batchesHost];
      case ValidRoles.teamCoach:
        if (
          !user.relationsAssign ||
          Object.keys(user.relationsAssign).length === 0
        )
          return [];
        const batchesTeamCoach = await this.phaseModel
          .find({
            _id: {
              $in: user.relationsAssign?.batches?.map(
                (i) => new Types.ObjectId(i._id),
              ),
            },
            deleted: false,
          })
          .lean();
        const phasesTeamCoach = await this.phaseModel
          .find({
            _id: {
              $in: batchesTeamCoach.map(
                (i) => new Types.ObjectId(i.childrenOf),
              ),
            },
            deleted: false,
          })
          .lean();
        return [...phasesTeamCoach, ...batchesTeamCoach];
      default:
        return await this.phaseModel.find({ deleted: false });
    }
  }

  async find(ids: string[]): Promise<Phase[]> {
    const phases = await this.phaseModel.find({ deleted: false });
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
      { deleted: true },
      { new: true },
    );
    return deletedPhase;
  }
}
