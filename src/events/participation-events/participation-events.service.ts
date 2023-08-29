import { Injectable } from '@nestjs/common';
import { CreateParticipationEventInput } from './dto/create-participation-event.input';

@Injectable()
export class ParticipationEventsService {
  constructor() {}
  create(createParticipationEventInput: CreateParticipationEventInput) {
    return 'This action adds a new participationEvent';
  }

  findAll() {
    return `This action returns all participationEvents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} participationEvent`;
  }
}
