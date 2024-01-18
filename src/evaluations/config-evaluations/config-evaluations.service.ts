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

  /**
   * create config evaluation
   */
  create(createConfigEvaluationInput: CreateConfigEvaluationInput) {
    return this.configEvaluationModel.create(createConfigEvaluationInput);
  }

  /**
   * find all config evaluation by user
   */
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

  /**
   * config evaluation by batch id
   */
  findByPhase(phase: string, user: AuthUser) {
    return this.configEvaluationModel.find({ phase }).lean();
  }

  /**
   * find config evaluation by id
   */
  findOne(id: string) {
    return this.configEvaluationModel.findById(id).lean();
  }

  /**
   * find evaluations that need to be done today
   */
  findToday(rol: ValidRoles) {
    // let infoSemana = this.obtenerInfoSemana();
    let today = new Date();
    // Configura las fechas para el rango del día específico
    const begin = new Date(today);
    begin.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    return this.configEvaluationModel
      .find({
        reviewer: rol,
        startAt: {
          $gte: begin,
          $lt: end,
        },
      })
      .lean();
  }

  /**
   * update config evaluation by id
   */
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

  /**
   * soft delete config evaluation by id
   */
  async remove(id: string) {
    const updatedType = await this.configEvaluationModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    return updatedType;
  }
}
