import { Injectable } from '@nestjs/common';
import { CreateIntegrationInput } from './dto/create-integration.input';
import { Integration } from './entities/integration.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class IntegrationsService {
  constructor(
    @InjectModel(Integration.name)
    private readonly integrationModel: Model<Integration>,
  ) {}

  async updateOrCreate(data: CreateIntegrationInput) {
    return await this.integrationModel
      .findOneAndUpdate(
        { typeIntegration: data.typeIntegration },
        { ...data },
        { new: true, upsert: true },
      )
      .lean();
  }

  findAll() {
    return this.integrationModel.find().lean();
  }
}
