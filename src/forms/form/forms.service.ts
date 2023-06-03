import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Form } from './entities/form.entity';
import { CreateFormInput } from './dto/create-form.input';
import { UpdateFormInput } from './dto/update-form.input';
import { FindFormsArgs } from './args/find-forms.args';
import { AuthUser } from 'src/auth/types/auth-user';

@Injectable()
export class FormsService {
  constructor(
    @InjectModel(Form.name) private readonly formModel: Model<Form>,
  ) {}

  async findMany(filters: FindFormsArgs) {
    return this.formModel.find({
      ...filters,
      deletedAt: null,
    });
  }

  async findOne(id: string): Promise<Form> {
    const form = await this.formModel.findById(id).lean();
    if (!form) throw new NotFoundException(`Couldn't find form with id ${id}`);
    return form;
  }

  async create(createFormInput: CreateFormInput, user: AuthUser) {
    const createdForm = await this.formModel.create(
      {
        ...createFormInput,
        createdBy: user.uid,
      });
    return createdForm;
  }

  async clone(id: string, user: AuthUser) {
    const formToClone = await this.findOne(id);
    const {
      _id,
      ...data
    } = formToClone;
    const clonedForm = await this.formModel.create({
      ...data,
      name: `Clon ${data.name}`,
      createdBy: user.uid,
    });
    return clonedForm;
  }

  async update(id: string, updateFormInput: Partial<UpdateFormInput>, user: AuthUser) {
    delete updateFormInput['_id'];
    const form = await this.formModel
      .findByIdAndUpdate(
        id,
        {
          ...updateFormInput, updatedBy: user.uid,
        },
        { new: true },
      )
      .lean();
    return form;
  }

  async delete(id: string, user: AuthUser) {
    const deletedForm = await this.update(id, { deletedAt: new Date(), deletedBy: user.uid }, user);
    return deletedForm;
  }
}
