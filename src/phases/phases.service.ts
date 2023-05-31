import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePhaseInput } from './dto/create-phase.input';
import { UpdatePhaseInput } from './dto/update-phase.input';
import { Phase } from './entities/phase.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthUser } from 'src/auth/types/auth-user';

@Injectable()
export class PhasesService {
  constructor(
    @InjectModel(Phase.name) private readonly phaseModel: Model<Phase>,
  ) {}

  async findAll(): Promise<Phase[]> {
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
      const father = await this.findOne(createPhaseInput.childrenOf);
      delete father['_id'];
      delete father['name'];
      delete father['description'];
      delete father['startAt'];
      delete father['endAt'];
      delete createPhaseInput['stage'];
      const createdBatch = await this.phaseModel.create({
        ...father,
        ...createPhaseInput,
        createdBy: user.uid,
      });
      return createdBatch;
    } else {
      console.log('new');
      const createdPhase = await this.phaseModel.create({
        ...createPhaseInput,
        createdBy: user.uid,
      });
      return createdPhase;
    }
  }

  async clone(id: string, user: AuthUser) {
    const existingPhase = await this.phaseModel.findById({ _id: id });
    const createdPhase = await this.phaseModel.create({
      ...existingPhase,
      childrenOf: id,
      createdBy: user.uid,
      basePhase: false,
    });
    return createdPhase;
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
