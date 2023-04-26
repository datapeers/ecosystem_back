import { Injectable } from '@nestjs/common';
import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';
import { InjectModel } from '@nestjs/mongoose';
import { Content } from './entities/content.entity';
import { Model } from 'mongoose';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name) private readonly contentModel: Model<Content>,
  ) {}

  create(createContentInput: CreateContentInput) {
    return this.contentModel.create(createContentInput);
  }

  findAll(phase: string) {
    return this.contentModel.find({ phase, 'extra_options.sprint': true });
    // .populate({
    //   path: 'childs',
    // });
  }

  findOne(id: string) {
    return this.contentModel.findById(id);
  }

  async update(id: string, updateContentInput: UpdateContentInput) {
    delete updateContentInput['_id'];
    const updatedContent = await this.contentModel
      .findOneAndUpdate({ _id: id }, { ...updateContentInput }, { new: true })
      .lean();
    return updatedContent;
  }

  async remove(id: string) {
    const updatedContent = await this.contentModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    return updatedContent;
  }
}
