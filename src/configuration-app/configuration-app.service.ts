import { Injectable } from '@nestjs/common';
import { UpdateConfigurationAppInput } from './dto/update-configuration-app.input';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigurationApp } from './entities/configuration-app.entity';

@Injectable()
export class ConfigurationAppService {
  constructor(
    @InjectModel(ConfigurationApp.name)
    private readonly configurationApp: Model<ConfigurationApp>,
  ) {}

  async onModuleInit() {
    let types = await this.configurationApp.find({});
    if (types.length === 0) {
      await this.configurationApp.create({ dashboard: 'Dashboard here!' });
    }
  }

  async find() {
    return (await this.configurationApp.find())[0];
  }

  async update(
    id: string,
    updateConfigurationAppInput: UpdateConfigurationAppInput,
  ) {
    delete updateConfigurationAppInput['_id'];
    const updatedStage = await this.configurationApp
      .findOneAndUpdate(
        { _id: id },
        { ...updateConfigurationAppInput },
        { new: true },
      )
      .lean();
    return updatedStage;
  }
}
