import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFormTagInput } from './dto/create-form-tag.input';
import { UpdateFormTagInput } from './dto/update-form-tag.input';
import { InjectModel } from '@nestjs/mongoose';
import { FormTag } from './entities/form-tag.entity';
import { Model } from 'mongoose';

@Injectable()
export class FormTagService {
  constructor(
    @InjectModel(FormTag.name) private readonly formTagModel: Model<FormTag>,
  ) {}
  /**
   * create form tag
   */
  async create(createFormTagInput: CreateFormTagInput) {
    const createdFormTag = await this.formTagModel.create(createFormTagInput);
    return createdFormTag;
  }

  /**
   * find all form tags
   */
  async findAll() {
    const tags = await this.formTagModel.find({ deletedAt: null }).lean();
    return tags;
  }

  /**
   * find list of form tags
   */
  async findMany(ids: string[]) {
    const tags = await this.formTagModel.find({ _id: { $in: ids } }).lean();
    return tags;
  }

  /**
   * find form tag by id
   */
  async findOne(id: string) {
    const tag = await this.formTagModel.findById(id).lean();
    if (!tag) throw new NotFoundException(`No tag found with id ${id}`);
    return tag;
  }

  /**
   * update form tag
   */
  async update(id: string, updateFormTagInput: UpdateFormTagInput) {
    delete updateFormTagInput['_id'];
    const formTag = await this.formTagModel
      .findByIdAndUpdate(id, { ...updateFormTagInput }, { new: true })
      .lean();
    return formTag;
  }

  /**
   * soft delete form tag
   */
  async delete(id: string) {
    const deletedForm = await this.formTagModel
      .findByIdAndUpdate(id, { deletedAt: Date.now() }, { new: true })
      .lean();
    return deletedForm;
  }
}
