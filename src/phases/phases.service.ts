import { Injectable } from '@nestjs/common';
import { CreatePhaseInput } from './dto/create-phase.input';
import { UpdatePhaseInput } from './dto/update-phase.input';

@Injectable()
export class PhasesService {
  create(createPhaseInput: CreatePhaseInput) {
    return 'This action adds a new phase';
  }

  findAll() {
    return `This action returns all phases`;
  }

  findOne(id: number) {
    return `This action returns a #${id} phase`;
  }

  update(id: number, updatePhaseInput: UpdatePhaseInput) {
    return `This action updates a #${id} phase`;
  }

  remove(id: number) {
    return `This action removes a #${id} phase`;
  }
}
