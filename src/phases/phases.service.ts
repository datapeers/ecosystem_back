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
    const phase = await this.phaseModel.findOne({ _id: id });
    if (!phase) throw new NotFoundException(`No phase found with id ${id}`);
    return phase;
  }

  async create(
    createPhaseInput: CreatePhaseInput,
    user: AuthUser,
  ): Promise<Phase> {
    const createdPhase = await this.phaseModel.create({
      ...createPhaseInput,
      createdBy: user.uid,
    });
    return createdPhase;
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

  remove(id: string) {
    this.phaseModel.updateOne({ _id: id }, { deleted: true });
  }
}
