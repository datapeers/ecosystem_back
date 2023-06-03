import { Inject, Injectable, forwardRef } from '@nestjs/common';
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

  async create(createContentInput: CreateContentInput) {
    if (createContentInput.extra_options?.parent) {
      const newContent = await this.contentModel.create(createContentInput);
      await this.contentModel.findByIdAndUpdate(
        createContentInput.extra_options?.parent,
        { $addToSet: { childs: newContent._id } },
      );
      return newContent;
    } else {
      return this.contentModel.create(createContentInput);
    }
  }

  findAll(phase: string) {
    return this.contentModel
      .find({ phase, 'extra_options.sprint': true, isDeleted: false })
      .populate({ path: 'childs', populate: 'resources' })
      .populate('resources')
      .lean();
  }

  findOne(id: string) {
    return this.contentModel
      .findById(id)
      .populate({ path: 'childs', populate: 'resources' })
      .populate('resources');
  }

  async update(id: string, updateContentInput: UpdateContentInput) {
    delete updateContentInput['_id'];
    const updatedContent = await this.contentModel
      .findOneAndUpdate({ _id: id }, { ...updateContentInput }, { new: true })
      .populate({ path: 'childs', populate: 'resources' })
      .populate('resources')
      .lean();
    return updatedContent;
  }

  async remove(id: string) {
    const updatedContent = await this.contentModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .populate({ path: 'childs', populate: 'resources' })
      .populate('resources')
      .lean();
    return updatedContent;
  }

  async addResource(contentID: string, id: string) {
    return await this.contentModel.findByIdAndUpdate(contentID, {
      $addToSet: { resources: id },
    });
  }

  createMany(content: Content[]) {
    return this.contentModel.insertMany(content);
  }
}
