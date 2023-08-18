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

  async findAll() {
    return (await this.stageModel.find({ isDeleted: false }).lean()).sort(
      (firstItem, secondItem) => firstItem.index - secondItem.index,
    );
  }

  findOne(id: string) {
    return this.stageModel.findById(id).lean();
  }

  async update(id: string, updateStageInput: UpdateStageInput) {
    delete updateStageInput['_id'];
    const updatedStage = await this.stageModel
      .findOneAndUpdate({ _id: id }, { ...updateStageInput }, { new: true })
      .lean();
    return updatedStage;
  }

  async modifyIndex(stageId: string, newIndex: number, type: 'up' | 'down') {
    const updatedStage = await this.stageModel
      .findOneAndUpdate(
        { _id: stageId },
        { $set: { index: newIndex } },
        { new: true },
      )
      .lean();
    switch (type) {
      case 'up':
        await this.stageModel.updateMany(
          {
            _id: { $ne: updatedStage._id },
            index: newIndex,
            isDeleted: false,
          },
          { $set: { index: newIndex - 1 } },
        );

        break;
      case 'down':
        await this.stageModel.updateMany(
          {
            _id: { $ne: updatedStage._id },
            index: newIndex,
            isDeleted: false,
          },
          { $set: { index: newIndex + 1 } },
        );
        break;
    }
    return updatedStage;
  }

  async remove(id: string) {
    const updatedStage = await this.stageModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    return updatedStage;
  }
}
