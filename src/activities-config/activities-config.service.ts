import { Injectable } from '@nestjs/common';
import { CreateActivitiesConfigInput } from './dto/create-activities-config.input';
import { UpdateActivitiesConfigInput } from './dto/update-activities-config.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivitiesConfig } from './entities/activities-config.entity';

@Injectable()
export class ActivitiesConfigService {
  constructor(
    @InjectModel(ActivitiesConfig.name)
    private readonly activitiesConfig: Model<ActivitiesConfig>,
  ) {}

  create(createActivitiesConfigInput: CreateActivitiesConfigInput) {
    return this.activitiesConfig.create(createActivitiesConfigInput);
  }

  async findByPhase(phase: string) {
    let item = await this.activitiesConfig.findOne({ phase });
    if (!item) {
      item = await this.create({
        limit: 0,
        totalLimit: 0,
        availability: {},
        phase,
      });
    }
    return item;
  }

  findOne(id: string) {
    return this.activitiesConfig.findById(id);
  }

  update(id: string, updateActivitiesConfigInput: UpdateActivitiesConfigInput) {
    delete updateActivitiesConfigInput['_id'];

    const updated = this.activitiesConfig
      .findOneAndUpdate(
        { _id: id },
        { ...UpdateActivitiesConfigInput },
        { new: true },
      )
      .lean();
    return updated;
  }

  async remove(id: string) {
    const updatedContent = await this.activitiesConfig
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    return updatedContent;
  }
}
