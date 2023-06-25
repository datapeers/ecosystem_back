import { Injectable } from '@nestjs/common';
import { CreateActaInput } from './dto/create-acta.input';
import { UpdateActaInput } from './dto/update-acta.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Acta } from './entities/acta.entity';

@Injectable()
export class ActaService {
  constructor(
    @InjectModel(Acta.name)
    private readonly actaModel: Model<Acta>,
  ) {}

  create(createActaInput: CreateActaInput) {
    return this.actaModel.create(createActaInput);
  }

  findAll() {
    return this.actaModel.find({});
  }

  findByEvent(event: string) {
    return this.actaModel.findOne({ event, isDeleted: false });
  }

  findOne(id: string) {
    return this.actaModel.findById(id);
  }

  async update(id: string, updateActaInput: UpdateActaInput) {
    delete updateActaInput['_id'];
    const updatedEvent = await this.actaModel
      .findOneAndUpdate({ _id: id }, { ...updateActaInput }, { new: true })
      .lean();
    return updatedEvent;
  }

  async remove(id: string) {
    const updatedType = await this.actaModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    return updatedType;
  }
}
