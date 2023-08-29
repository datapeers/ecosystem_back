import { Injectable } from '@nestjs/common';
import { CreateParticipationEventInput } from './dto/create-participation-event.input';
import { InjectModel } from '@nestjs/mongoose';
import { ParticipationEvent } from './entities/participation-event.entity';
import { Model } from 'mongoose';
import { UpdateParticipationEventInput } from './dto/update-participation-event.input';

@Injectable()
export class ParticipationEventsService {
  constructor(
    @InjectModel(ParticipationEvent.name)
    private readonly participationEventModel: Model<ParticipationEvent>,
  ) {}

  create(createParticipationEventInput: CreateParticipationEventInput) {
    return this.participationEventModel.create(createParticipationEventInput);
  }

  findAll() {
    return this.participationEventModel.find({});
  }

  findOne(id: string) {
    return this.participationEventModel.findById(id).lean();
  }

  findByEvent(event: string) {
    return this.participationEventModel.find({ event }).lean();
  }

  findByEventAndParticipant(event: string, participant: string) {
    return this.participationEventModel.findOne({ event, participant }).lean();
  }

  async update(
    id: string,
    updateParticipationEventInput: UpdateParticipationEventInput,
  ) {
    delete updateParticipationEventInput['_id'];
    const updatedEvent = await this.participationEventModel
      .findOneAndUpdate(
        { _id: id },
        { ...updateParticipationEventInput },
        { new: true },
      )
      .lean();
    return updatedEvent;
  }
}
