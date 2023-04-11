import {
  Injectable,
  NotFoundException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { CreatePhaseInput } from './dto/create-phase.input';
import { UpdatePhaseInput } from './dto/update-phase.input';
import { Phase } from './entities/phase.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class PhasesService {
  constructor(
    @InjectModel(Phase.name) private readonly phaseModel: Model<Phase>,
  ) {}

  async create(createPhaseInput: CreatePhaseInput) {
    const createdUser = await this.phaseModel.create(createPhaseInput);
    return createdUser;
  }

  findAll() {
    return `This action returns all phases`;
  }

  async findOne(id: string) {
    const phase = await this.phaseModel.findOne({ _id: id });
    if (!phase) throw new NotFoundException(`No phase found with id ${id}`);
    return phase;
  }

  update(id: number, updatePhaseInput: UpdatePhaseInput) {
    return `This action updates a #${id} phase`;
  }

  remove(id: number) {
    return `This action removes a #${id} phase`;
  }
}
