import { Injectable } from '@nestjs/common';
import { CreateStageInput } from './dto/create-stage.input';
import { UpdateStageInput } from './dto/update-stage.input';
import { InjectModel } from '@nestjs/mongoose';
import { Stage } from './entities/stage.entity';
import { Model } from 'mongoose';

@Injectable()
export class StagesService {
  constructor(
    @InjectModel(Stage.name) private readonly stageModel: Model<Stage>,
  ) {}

  create(createStageInput: CreateStageInput) {
    return this.stageModel.create(createStageInput);
  }

  findAll() {
    return this.stageModel.find({ isDeleted: false });
  }

  findOne(id: string) {
    return this.stageModel.findById(id);
  }

  async update(id: string, updateStageInput: UpdateStageInput) {
    delete updateStageInput['_id'];
    const updatedStage = await this.stageModel
      .findOneAndUpdate({ _id: id }, { ...updateStageInput }, { new: true })
      .lean();
    return updatedStage;
  }

  async remove(id: string) {
    const updatedStage = await this.stageModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    return updatedStage;
  }
}
