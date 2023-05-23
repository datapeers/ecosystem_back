import { Injectable } from '@nestjs/common';
import { CreateTypesEventInput } from './dto/create-types-event.input';
import { UpdateTypesEventInput } from './dto/update-types-event.input';
import { InjectModel } from '@nestjs/mongoose';
import { TypesEvent } from './entities/types-event.entity';
import { Model } from 'mongoose';

@Injectable()
export class TypesEventsService {
  constructor(
    @InjectModel(TypesEvent.name)
    private readonly typeEventModel: Model<TypesEvent>,
  ) {}

  create(createTypeEventInput: CreateTypesEventInput) {
    return this.typeEventModel.create(createTypeEventInput);
  }

  findAll() {
    return this.typeEventModel.find({});
  }

  findOne(id: string) {
    return this.typeEventModel.findById(id);
  }

  async update(id: string, updateTypeEventInput: UpdateTypesEventInput) {
    delete updateTypeEventInput['_id'];
    const updatedType = await this.typeEventModel
      .findOneAndUpdate({ _id: id }, { ...updateTypeEventInput }, { new: true })
      .lean();
    return updatedType;
  }

  async remove(id: string) {
    const updatedType = await this.typeEventModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    return updatedType;
  }
}
