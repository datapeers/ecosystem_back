import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivitiesConfigService {
  create(createActivitiesConfigInput) {
    return 'This action adds a new activitiesConfig';
  }

  findAll() {
    return `This action returns all activitiesConfig`;
  }

  findOne(id: number) {
    return `This action returns a #${id} activitiesConfig`;
  }

  update(id: number, updateActivitiesConfigInput) {
    return `This action updates a #${id} activitiesConfig`;
  }

  remove(id: number) {
    return `This action removes a #${id} activitiesConfig`;
  }
}
