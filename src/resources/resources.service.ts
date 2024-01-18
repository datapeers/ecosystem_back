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

  /**
   * create a new resource
   */
  async create(createResourceInput: CreateResourceInput) {
    const newResource = await this.resourceModel.create(createResourceInput);
    const contentModified = await this.contentService.addResource(
      createResourceInput.content,
      newResource._id,
    );
    return newResource;
  }

  /**
   * find all resources of a content
   */
  findAllByContent(content: string) {
    return this.resourceModel.find({ content, isDeleted: false });
  }

  /**
   * find all resources of a content
   */
  findAllByPhase(content: string) {
    return this.resourceModel.find({ content, isDeleted: false });
  }

  /**
   * find resources by id
   */
  findOne(id: string) {
    return this.resourceModel.findById(id).lean();
  }

  /**
   * update resource
   */
  async update(id: string, updateContentInput: UpdateResourceInput) {
    delete updateContentInput['_id'];
    const updatedContent = await this.resourceModel
      .findOneAndUpdate({ _id: id }, { ...updateContentInput }, { new: true })

      .lean();
    return updatedContent;
  }

  /**
   * soft delete resource
   */
  async remove(id: string) {
    const updatedContent = await this.resourceModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })

      .lean();
    return updatedContent;
  }

  /**
   * create many resources
   */
  createMany(resources: Resource[]) {
    return this.resourceModel.insertMany(resources);
  }
}
