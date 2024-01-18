import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateRolInput } from './dto/create-rol.input';
import { UpdateRolInput } from './dto/update-rol.input';
import { InjectModel } from '@nestjs/mongoose';
import { Rol } from './entities/rol.entity';
import { Model, Types } from 'mongoose';
import { defaultRoles } from './model/rol';
@Injectable()
export class RolService implements OnModuleInit {
  constructor(@InjectModel(Rol.name) private readonly rolModel: Model<Rol>) {}

  /**
   * initialize roles app
   */
  async onModuleInit() {
    let roles = await this.rolModel.find({});
    if (roles.length === 0) {
      await this.rolModel.insertMany(defaultRoles);
    }
  }

  /**
   * create a rol
   */
  async create(createRolInput: CreateRolInput) {
    return this.rolModel.create(createRolInput);
  }

  /**
   * find all roles
   */
  async findAll() {
    return this.rolModel.find({}).lean();
  }

  /**
   * find rol by id
   */
  async findOne(id: string) {
    const rol = await this.rolModel.findOne({ _id: id }).lean();
    if (!rol) throw new NotFoundException(`No rol found with id ${id}`);
    return rol;
  }

  /**
   * find rol by type
   */
  async findByType(type: string) {
    const rol = await this.rolModel.findOne({ type }).lean();
    if (!rol) throw new NotFoundException(`No rol found with type ${type}`);
    return rol;
  }

  /**
   * update a rol
   */
  async update(id: string, updateRolInput: UpdateRolInput) {
    delete updateRolInput['_id'];
    const updatedRol = await this.rolModel
      .findOneAndUpdate({ _id: id }, { ...updateRolInput }, { new: true })
      .lean();
    return updatedRol;
  }

  /**
   * delete rol
   */
  async remove(id: string) {
    const deletedPhase = await this.rolModel.deleteOne({ _id: id });
    return deletedPhase;
  }
}
