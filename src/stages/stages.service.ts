import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateStageInput } from './dto/create-stage.input';
import { UpdateStageInput } from './dto/update-stage.input';
import { InjectModel } from '@nestjs/mongoose';
import { Stage } from './entities/stage.entity';
import { Model } from 'mongoose';
import { default_stages } from './models/stages-default';

@Injectable()
export class StagesService implements OnModuleInit {
  constructor(
    @InjectModel(Stage.name) private readonly stageModel: Model<Stage>,
  ) {}

  async onModuleInit() {
    let types = await this.stageModel.find({});
    if (types.length === 0) {
      await this.stageModel.insertMany(default_stages);
    }
  }

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
