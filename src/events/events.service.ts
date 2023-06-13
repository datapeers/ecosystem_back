import { Injectable } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './entities/event.entity';
@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,
  ) {}

  create(createEventInput: CreateEventInput) {
    return this.eventModel.create(createEventInput);
  }

  findAll() {
    return this.eventModel.find({});
  }

  findOne(id: string) {
    return this.eventModel.findById(id);
  }

  async update(id: string, updateEventInput: UpdateEventInput) {
    delete updateEventInput['_id'];
    const updatedEvent = await this.eventModel
      .findOneAndUpdate({ _id: id }, { ...updateEventInput }, { new: true })
      .lean();
    return updatedEvent;
  }

  async remove(id: string) {
    const updatedType = await this.eventModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    return updatedType;
  }
}
