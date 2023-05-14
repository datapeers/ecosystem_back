import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFormTagInput } from './dto/create-form-tag.input';
import { UpdateFormTagInput } from './dto/update-form-tag.input';
import { InjectModel } from '@nestjs/mongoose';
import { FormTag } from './entities/form-tag.entity';
import { Model } from 'mongoose';

@Injectable()
export class FormTagService {

  constructor(
    @InjectModel(FormTag.name) private readonly formTagModel: Model<FormTag>
  ) {

  }

  async create(createFormTagInput: CreateFormTagInput) {
    const createdFormTag = await this.formTagModel.create(createFormTagInput);
    return createdFormTag;
  }

  async findAll() {
    const tags = await this.formTagModel.find({ deletedAt: null }).lean();
    return tags;
  }

  async findMany(ids: string[]) {
    const tags = await this.formTagModel.find({ _id: { $in: ids } }).lean();
    return tags;
  }

  async findOne(id: string) {
    const tag = await this.formTagModel.findById(id).lean();
    if(!tag) throw new NotFoundException(`No tag found with id ${id}`);
    return tag;
  }

  async update(id: string, updateFormTagInput: UpdateFormTagInput) {
    delete updateFormTagInput["_id"];
    const formTag = await this.formTagModel
      .findByIdAndUpdate(id,
        { ...updateFormTagInput },
        { new: true }
      ).lean();
    return formTag;
  }

  async delete(id: string) {
    const deletedForm = await this.formTagModel
    .findByIdAndUpdate(id,
      { deletedAt: Date.now() },
      { new: true }
    ).lean();
    return deletedForm;
  }
}
