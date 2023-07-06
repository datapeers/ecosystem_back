import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRolInput } from './dto/create-rol.input';
import { UpdateRolInput } from './dto/update-rol.input';
import { InjectModel } from '@nestjs/mongoose';
import { Rol } from './entities/rol.entity';
import { Model, Types } from 'mongoose';
import { defaultRoles } from './model/rol';
@Injectable()
export class RolService {
  constructor(@InjectModel(Rol.name) private readonly rolModel: Model<Rol>) {}

  async create(createRolInput: CreateRolInput) {
    return this.rolModel.create(createRolInput);
  }

  async findAll() {
    return this.rolModel.find({});
  }

  async findOne(id: string) {
    const rol = await this.rolModel.findOne({ _id: id }).lean();
    if (!rol) throw new NotFoundException(`No rol found with id ${id}`);
    return rol;
  }

  async update(id: string, updateRolInput: UpdateRolInput) {
    delete updateRolInput['_id'];
    const updatedRol = await this.rolModel
      .findOneAndUpdate({ _id: id }, { ...updateRolInput }, { new: true })
      .lean();
    return updatedRol;
  }

  async remove(id: string) {
    const deletedPhase = await this.rolModel.deleteOne({ _id: id });
    return deletedPhase;
  }
}
