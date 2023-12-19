import { Injectable } from '@nestjs/common';
import { UpdateTermsOfUseInput } from './dto/update-terms-of-use.input';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TermsOfUse } from './entities/terms-of-use.entity';

@Injectable()
export class TermsOfUseService {
  constructor(
    @InjectModel(TermsOfUse.name)
    private readonly termsOfUseModel: Model<TermsOfUse>,
  ) {}

  // create(createTermsOfUseInput: CreateTermsOfUseInput) {
  //   return this.termsOfUseModel.create(createTermsOfUseInput);
  // }

  findAll() {
    return this.termsOfUseModel.find().lean();
  }

  findOne(name: string) {
    return this.termsOfUseModel
      .findOneAndUpdate({ name: name }, { name }, { new: true, upsert: true })
      .lean();
  }

  update(id: string, updateTermsOfUseInput: UpdateTermsOfUseInput) {
    delete updateTermsOfUseInput['_id'];
    return this.termsOfUseModel
      .findOneAndUpdate(
        { _id: id },
        { ...updateTermsOfUseInput },
        { new: true },
      )
      .lean();
  }

  remove(id: number) {
    return `This action removes a #${id} termsOfUse`;
  }
}