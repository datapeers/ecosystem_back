import { Injectable } from '@nestjs/common';
import { CreateResourceInput } from './dto/create-resource.input';
import { UpdateResourceInput } from './dto/update-resource.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resource } from './entities/resource.entity';
@Injectable()
export class ResourcesService {
  constructor(
    @InjectModel(Resource.name) private readonly resourceModel: Model<Resource>,
  ) {}

  async create(createResourceInput: CreateResourceInput) {
    return this.resourceModel.create(createResourceInput);
  }

  findAllByContent(content: string) {
    return this.resourceModel.find({ content, isDeleted: false });
  }

  findAllByPhase(content: string) {
    return this.resourceModel.find({ content, isDeleted: false });
  }

  findOne(id: string) {
    return this.resourceModel.findById(id);
  }

  async update(id: string, updateContentInput: UpdateResourceInput) {
    delete updateContentInput['_id'];
    const updatedContent = await this.resourceModel
      .findOneAndUpdate({ _id: id }, { ...updateContentInput }, { new: true })

      .lean();
    return updatedContent;
  }

  async remove(id: string) {
    const updatedContent = await this.resourceModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })

      .lean();
    return updatedContent;
  }
}
