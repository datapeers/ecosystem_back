import { Injectable } from '@nestjs/common';
import { CreateParticipationEventInput } from './dto/create-participation-event.input';
import { InjectModel } from '@nestjs/mongoose';
import { ParticipationEvent } from './entities/participation-event.entity';
import { Model, Types } from 'mongoose';
import { UpdateParticipationEventInput } from './dto/update-participation-event.input';

@Injectable()
export class ParticipationEventsService {
  constructor(
    @InjectModel(ParticipationEvent.name)
    private readonly participationEventModel: Model<ParticipationEvent>,
  ) {}

  /**
   * create a register of participant event
   */
  create(createParticipationEventInput: CreateParticipationEventInput) {
    return this.participationEventModel.create(createParticipationEventInput);
  }

  /**
   * find all registers
   */
  findAll() {
    return this.participationEventModel.find({});
  }

  /**
   * find participation register by id
   */
  findOne(id: string) {
    return this.participationEventModel.findById(id).lean();
  }

  /**
   * find participation register by event
   */
  findByEvent(event: string) {
    return this.participationEventModel.find({ event }).lean();
  }

  /**
   * find participation register by events
   */
  findByEvents(events: string[]) {
    return this.participationEventModel.find({ event: { $in: events } }).lean();
  }

  /**
   * find participation register by event and participant
   */
  findByEventAndParticipant(event: string, participant: string) {
    return this.participationEventModel.findOne({ event, participant }).lean();
  }

  /**
   * update participation register
   */
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
