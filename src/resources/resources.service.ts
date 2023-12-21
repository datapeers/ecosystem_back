import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateResourceInput } from './dto/create-resource.input';
import { UpdateResourceInput } from './dto/update-resource.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Resource } from './entities/resource.entity';
import { ContentService } from 'src/content/content.service';
@Injectable()
export class ResourcesService {
  constructor(
    @InjectModel(Resource.name) private readonly resourceModel: Model<Resource>,
    @Inject(forwardRef(() => ContentService))
    private readonly contentService: ContentService,
  ) {}

  async create(createResourceInput: CreateResourceInput) {
    const newResource = await this.resourceModel.create(createResourceInput);
    const contentModified = await this.contentService.addResource(
      createResourceInput.content,
      newResource._id,
    );
    return newResource;
  }

  findAllByContent(content: string) {
    return this.resourceModel.find({ content, isDeleted: false });
  }

  findAllByPhase(content: string) {
    return this.resourceModel.find({ content, isDeleted: false });
  }

  findOne(id: string) {
    return this.resourceModel.findById(id).lean();
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

  createMany(resources: Resource[]) {
    return this.resourceModel.insertMany(resources);
  }
}
