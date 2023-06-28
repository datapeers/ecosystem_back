import { Injectable } from '@nestjs/common';
import { CreateSiteInput } from './dto/create-site.input';
import { UpdateSiteInput } from './dto/update-site.input';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Site } from './entities/site.entity';

@Injectable()
export class SitesService {
  constructor(
    @InjectModel(Site.name) private readonly siteModel: Model<Site>,
  ) {}

  create(createSiteInput: CreateSiteInput) {
    return this.siteModel.create(createSiteInput);
  }

  findAll() {
    return this.siteModel.find({ isDeleted: false });
  }

  findOne(id: string) {
    return this.siteModel.findById(id);
  }

  async update(id: string, updateSiteInput: UpdateSiteInput) {
    delete updateSiteInput['_id'];
    const updatedEvent = await this.siteModel
      .findOneAndUpdate({ _id: id }, { ...updateSiteInput }, { new: true })
      .lean();
    return updatedEvent;
  }

  async remove(id: string) {
    const updatedType = await this.siteModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    return updatedType;
  }
}
