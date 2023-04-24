import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Form } from './entities/form.entity';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormInput } from './dto/update-form.input';

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form.name) private readonly formModel: Model<Form>
  ) {
    
  }

  async findAll() {
    return this.formModel.find({
      isDeleted: false
    });
  }

  async findOne(id: string): Promise<Form> {
    const form = await this.formModel.findById(id).lean();
    if(!form) throw new NotFoundException(`Couldn't find form with id ${id}`);
    return form;
  }

  async create(createFormInput: CreateFormInput) {
    const createdForm = await this.formModel.create(createFormInput);
    return createdForm;
  }
  
  async clone(id: string) {
    const formToClone = await this.findOne(id);
    const { _id, ...data } = formToClone;
    const clonedForm = await this.formModel.create(data);
    return clonedForm;
  }

  async update(id: string, updateFormInput: Partial<UpdateFormInput>) {
    delete updateFormInput["_id"];
    const form = await this.formModel
      .findOneAndUpdate({ id }, {
        ...updateFormInput
      }, { new: true })
      .lean();
    return form;
  }

  async delete(id: string) {
    const deletedForm = await this.update(id, { isDeleted: true });
    return deletedForm;
  }
}
