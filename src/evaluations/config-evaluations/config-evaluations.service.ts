import { Injectable } from '@nestjs/common';
import { CreateConfigEvaluationInput } from './dto/create-config-evaluation.input';
import { UpdateConfigEvaluationInput } from './dto/update-config-evaluation.input';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigEvaluation } from './entities/config-evaluation.entity';
import { Model } from 'mongoose';

@Injectable()
export class ConfigEvaluationsService {
  constructor(
    @InjectModel(ConfigEvaluation.name)
    private readonly configEvaluationModel: Model<ConfigEvaluation>,
  ) {}

  create(createConfigEvaluationInput: CreateConfigEvaluationInput) {
    return this.configEvaluationModel.create(createConfigEvaluationInput);
  }

  findAll() {
    return this.configEvaluationModel.find().lean();
  }

  findOne(id: number) {
    return this.configEvaluationModel.findById(id).lean();
  }

  async update(
    id: string,
    updateConfigEvaluationInput: UpdateConfigEvaluationInput,
  ) {
    delete updateConfigEvaluationInput['_id'];
    const updatedEvent = await this.configEvaluationModel
      .findOneAndUpdate(
        { _id: id },
        { ...updateConfigEvaluationInput },
        { new: true },
      )
      .lean();
    return updatedEvent;
  }

  async remove(id: string) {
    const updatedType = await this.configEvaluationModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    return updatedType;
  }
}
