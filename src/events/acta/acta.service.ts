import { Injectable } from '@nestjs/common';
import { CreateActaInput } from './dto/create-acta.input';
import { UpdateActaInput } from './dto/update-acta.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Acta } from './entities/acta.entity';

@Injectable()
export class ActaService {
  constructor(
    @InjectModel(Acta.name)
    private readonly actaModel: Model<Acta>,
  ) {}

  /**
   * create acta of a event
   */
  create(createActaInput: CreateActaInput) {
    return this.actaModel.create(createActaInput);
  }

  /**
   * find all actas
   */
  findAll() {
    return this.actaModel.find({});
  }

  /**
   * find acta by event id
   */
  findByEvent(event: string) {
    return this.actaModel.findOne({ event, isDeleted: false });
  }

  /**
   * find actas of event list
   */
  findByEventsList(events: string[]) {
    return this.actaModel
      .find({
        isDeleted: false,
        event: { $in: events.map((i) => new Types.ObjectId(i)) },
      })
      .lean();
  }

  /**
   * find acta by id
   */
  findOne(id: string) {
    return this.actaModel.findById(id);
  }

  /**
   * update acta
   */
  async update(id: string, updateActaInput: UpdateActaInput) {
    delete updateActaInput['_id'];
    const updatedEvent = await this.actaModel
      .findOneAndUpdate({ _id: id }, { ...updateActaInput }, { new: true })
      .lean();
    return updatedEvent;
  }

  /**
   * soft delete acta
   */
  async remove(id: string) {
    const updatedType = await this.actaModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    return updatedType;
  }
}
