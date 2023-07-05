import { Injectable } from '@nestjs/common';
import { CreateRolInput } from './dto/create-rol.input';
import { UpdateRolInput } from './dto/update-rol.input';

@Injectable()
export class RolService {
  create(createRolInput: CreateRolInput) {
    return 'This action adds a new rol';
  }

  findAll() {
    return `This action returns all rol`;
  }

  findOne(id: string) {
    return `This action returns a #${id} rol`;
  }

  update(id: string, updateRolInput: UpdateRolInput) {
    return `This action updates a #${id} rol`;
  }

  remove(id: string) {
    return `This action removes a #${id} rol`;
  }
}
