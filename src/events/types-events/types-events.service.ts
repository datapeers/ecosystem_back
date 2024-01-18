import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateTypesEventInput } from './dto/create-types-event.input';
import { UpdateTypesEventInput } from './dto/update-types-event.input';
import { InjectModel } from '@nestjs/mongoose';
import { TypesEvent } from './entities/types-event.entity';
import { Model } from 'mongoose';
import { default_types_events } from './model/type-events.default';
@Injectable()
export class TypesEventsService implements OnModuleInit {
  constructor(
    @InjectModel(TypesEvent.name)
    private readonly typeEventModel: Model<TypesEvent>,
  ) {}
  /**
   * initialize types of events in app
   */
  async onModuleInit() {
    let types = await this.typeEventModel.find({});
    if (types.length === 0) {
      await this.typeEventModel.insertMany(default_types_events);
    }
  }

  /**
   * create new type of event
   */
  create(createTypeEventInput: CreateTypesEventInput) {
    return this.typeEventModel.create(createTypeEventInput);
  }

  /**
   * find all type of events
   */
  findAll() {
    return this.typeEventModel.find({ isDeleted: false }).lean();
  }

  /**
   * find type of event by id
   */
  findOne(id: string) {
    return this.typeEventModel.findById(id).lean();
  }

  /**
   * update type of event
   */
  async update(id: string, updateTypeEventInput: UpdateTypesEventInput) {
    delete updateTypeEventInput['_id'];
    const updatedType = await this.typeEventModel
      .findOneAndUpdate({ _id: id }, { ...updateTypeEventInput }, { new: true })
      .lean();
    return updatedType;
  }

  /**
   * soft delete type of event
   */
  async remove(id: string) {
    const updatedType = await this.typeEventModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    return updatedType;
  }
}
