import { Injectable } from '@nestjs/common';
import { CreateConfigEvaluationInput } from './dto/create-config-evaluation.input';
import { UpdateConfigEvaluationInput } from './dto/update-config-evaluation.input';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigEvaluation } from './entities/config-evaluation.entity';
import { Model } from 'mongoose';
import { AuthUser } from 'src/auth/types/auth-user';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Injectable()
export class ConfigEvaluationsService {
  constructor(
    @InjectModel(ConfigEvaluation.name)
    private readonly configEvaluationModel: Model<ConfigEvaluation>,
  ) {}

  create(createConfigEvaluationInput: CreateConfigEvaluationInput) {
    return this.configEvaluationModel.create(createConfigEvaluationInput);
  }

  findAll(user?: AuthUser) {
    switch (user.rolDoc.type) {
      case ValidRoles.expert:
        return this.configEvaluationModel
          .find({ reviewer: ValidRoles.expert })
          .lean();
      case ValidRoles.teamCoach:
        return this.configEvaluationModel
          .find({ reviewer: ValidRoles.teamCoach })
          .lean();
      default:
        return this.configEvaluationModel.find().lean();
    }
  }

  findByPhase(phase: string, user: AuthUser) {
    return this.configEvaluationModel.find({ phase }).lean();
  }

  findOne(id: string) {
    return this.configEvaluationModel.findById(id).lean();
  }

  async update(
    id: string,
    updateConfigEvaluationInput: UpdateConfigEvaluationInput,
  ) {
    delete updateConfigEvaluationInput['_id'];
    const updatedEvent = await this.configEvaluationModel
      .findOneAndUpdate(
        { _id: id },
        { ...updateConfigEvaluationInput },
        { new: true },
      )
      .lean();
    return updatedEvent;
  }

  async remove(id: string) {
    const updatedType = await this.configEvaluationModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    return updatedType;
  }
}
