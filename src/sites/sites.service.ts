import { Injectable } from '@nestjs/common';
import { CreateSiteInput } from './dto/create-site.input';
import { UpdateSiteInput } from './dto/update-site.input';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Site } from './entities/site.entity';
/**
 * services
 */
@Injectable()
export class SitesService {
  constructor(
    @InjectModel(Site.name) private readonly siteModel: Model<Site>,
  ) {}

  /**
   * create a service
   */
  create(createSiteInput: CreateSiteInput) {
    return this.siteModel.create(createSiteInput);
  }

  /**
   * find all service
   */
  findAll() {
    return this.siteModel.find({ isDeleted: false });
  }

  /**
   * find service by id
   */
  findOne(id: string) {
    return this.siteModel.findById(id);
  }

  /**
   * update service
   */
  async update(id: string, updateSiteInput: UpdateSiteInput) {
    delete updateSiteInput['_id'];
    const updatedEvent = await this.siteModel
      .findOneAndUpdate({ _id: id }, { ...updateSiteInput }, { new: true })
      .lean();
    return updatedEvent;
  }

  /**
   * soft delete service
   */
  async remove(id: string) {
    const updatedType = await this.siteModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    return updatedType;
  }
}
