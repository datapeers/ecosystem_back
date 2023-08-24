import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateContentInput } from './dto/create-content.input';
import { UpdateContentInput } from './dto/update-content.input';
import { InjectModel } from '@nestjs/mongoose';
import { Content } from './entities/content.entity';
import { Model } from 'mongoose';
import { AuthUser } from '../auth/types/auth-user';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
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

  async findAll(phase: string, user?: AuthUser): Promise<Content[]> {
    if (user?.rolDoc.type === ValidRoles.user) {
      let sprints = await this.contentModel
        .find({
          phase,
          'extra_options.sprint': true,
          isDeleted: false,
          hide: false,
        })
        .populate({ path: 'childs', populate: 'resources' })
        .populate('resources')
        .lean();
      return this.checkStateDisplayUser(sprints);
    } else {
      return this.contentModel
        .find({ phase, 'extra_options.sprint': true, isDeleted: false })
        .populate({ path: 'childs', populate: 'resources' })
        .populate('resources')
        .lean();
    }
  }

  findById(id: string) {
    return this.contentModel.findById(id).lean();
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

  checkStateDisplayUser(sprints: Content[]) {
    let sprintsFiltered = [];
    for (const sprint of sprints) {
      const childsSprint = [];
      for (const child of sprint.childs) {
        if (child.isDeleted || child.hide) continue;
        const resourcesChild = child.resources.filter(
          (i) => !i.isDeleted && !i.hide,
        );
        childsSprint.push({ ...child, resources: resourcesChild });
      }
      const resourcesSprint = sprint.resources.filter(
        (i) => !i.isDeleted && !i.hide,
      );
      sprintsFiltered.push({
        ...sprint,
        childs: childsSprint,
        resources: resourcesSprint,
      });
    }
    return sprintsFiltered;
  }
}
