import { CreateEvaluationInput } from './dto/create-evaluation.input';
import { InjectModel } from '@nestjs/mongoose';
import { Evaluation } from './entities/evaluation.entity';
import { Model, Types } from 'mongoose';
import { UpdateResultPayload } from 'src/shared/models/update-result';
import { AuthUser } from 'src/auth/types/auth-user';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigEvaluationsService } from './config-evaluations/config-evaluations.service';
import { ExpertService } from 'src/expert/expert.service';
import { StartupService } from 'src/startup/startup.service';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class EvaluationsService {
  canBeEvaluated = [ValidRoles.user, ValidRoles.teamCoach, ValidRoles.expert];
  canBeReviewer = [ValidRoles.host, ValidRoles.teamCoach, ValidRoles.expert];
  constructor(
    @InjectModel(Evaluation.name)
    private readonly evaluationModel: Model<Evaluation>,
    @Inject(forwardRef(() => ConfigEvaluationsService))
    private readonly configService: ConfigEvaluationsService,
    @Inject(forwardRef(() => StartupService))
    private readonly startupService: StartupService,
    @Inject(forwardRef(() => ExpertService))
    private readonly expertService: ExpertService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async getDocument(id: string) {
    const document = await this.findOne(id);
    return document;
  }

  async createDocument(submission: any, context?: any) {
    const data = {
      ...context,
      item: submission,
    };
    const createdDocument = await this.create(data);
    return createdDocument;
  }

  async updateDocument(id: string, submission: any, context: any) {
    const updatedDocument = await this.update(id, { item: submission });
    return updatedDocument;
  }

  findAll() {
    return this.evaluationModel.find();
  }

  async findByConfig(config: string, user: AuthUser) {
    const configEvaluation = await this.configService.findOne(config);
    const evaluations = await this.evaluationModel
      .find({
        config,
        isDeleted: false,
      })
      .lean();
    if (!this.canBeEvaluated.includes(configEvaluation.evaluated as ValidRoles))
      throw new BadRequestException('Invalid evaluated', {
        cause: new Error(),
        description: 'Evaluated its not a valid type for this endpoint',
      });
    if (!this.canBeReviewer.includes(configEvaluation.reviewer as ValidRoles))
      throw new BadRequestException('Invalid reviewer', {
        cause: new Error(),
        description: 'Reviewer its not a valid type for this endpoint',
      });
    let ansList: Evaluation[] = [];
    switch (configEvaluation.evaluated) {
      case ValidRoles.user:
        const startupList = await this.startupService.findByPhase(
          configEvaluation.phase,
          user,
        );
        for (const startup of startupList) {
          let evaluation = evaluations.find(
            (i) =>
              i.evaluated === startup._id.toString() &&
              i.config === configEvaluation._id.toString(),
          );
          if (!evaluation)
            evaluation = this.createSimpleEvaluation(
              startup._id.toString(),
              configEvaluation._id.toString(),
              'pendiente',
              configEvaluation.form,
            );
          ansList.push(evaluation);
        }
        break;
      case ValidRoles.teamCoach:
        const teamCoachList = await this.usersService.findMany({
          roles: [ValidRoles.teamCoach],
          relationsAssign: { batches: configEvaluation.phase },
        });
        for (const teamCoach of teamCoachList) {
          let evaluation = evaluations.find(
            (i) =>
              i.evaluated === teamCoach._id.toString() &&
              i.config === configEvaluation._id.toString(),
          );
          if (!evaluation)
            evaluation = this.createSimpleEvaluation(
              teamCoach._id.toString(),
              configEvaluation._id.toString(),
              'pendiente',
              configEvaluation.form,
            );
          ansList.push(evaluation);
        }
        break;
      case ValidRoles.expert:
        const expertList = await this.expertService.findByPhase(
          configEvaluation.phase,
        );
        for (const expert of expertList) {
          let evaluation = evaluations.find(
            (i) =>
              i.evaluated === expert._id.toString() &&
              i.config === configEvaluation._id.toString(),
          );
          if (!evaluation)
            evaluation = this.createSimpleEvaluation(
              expert._id.toString(),
              configEvaluation._id.toString(),
              'pendiente',
              configEvaluation.form,
            );
          ansList.push(evaluation);
        }
        break;
      default:
        break;
    }
    return ansList;
  }

  async findOne(id: string): Promise<Evaluation> {
    const evaluation = await this.evaluationModel.findById(id);
    if (!evaluation)
      throw new NotFoundException(`Couldn't find evaluation with id ${id}`);
    return evaluation;
  }

  async create(data: CreateEvaluationInput): Promise<Evaluation> {
    const createdEvaluation = await this.evaluationModel.create(data);
    return createdEvaluation;
  }

  async update(id: string, data: Partial<Evaluation>): Promise<Evaluation> {
    await this.evaluationModel
      .updateOne({ _id: id }, data, { new: true })
      .lean();
    return this.findOne(id);
  }

  async delete(ids: string[]): Promise<UpdateResultPayload> {
    const updateResult = await this.evaluationModel.updateMany(
      { _id: { $in: ids.map((id) => new Types.ObjectId(id)) } },
      { isDeleted: true },
    );
    return {
      ...updateResult,
      upsertedId: updateResult.upsertedId?.toString(),
    };
  }

  createSimpleEvaluation(
    evaluated: string,
    config: string,
    state: string,
    form: string,
  ) {
    const newEvaluation = new Evaluation();
    newEvaluation._id = new Types.ObjectId().toString();
    newEvaluation.item = {} as any;
    newEvaluation.evaluated = evaluated;
    newEvaluation.reviewer = '';
    newEvaluation.form = form;
    newEvaluation.config = config;
    newEvaluation.state = state;
    newEvaluation.createdAt = new Date();
    newEvaluation.updatedAt = new Date();
    newEvaluation.isDeleted = false;
    return newEvaluation;
  }

  async getName(evaluation: Evaluation) {
    const configEvaluation = await this.configService.findOne(
      evaluation.config,
    );
    switch (configEvaluation.evaluated) {
      case ValidRoles.user:
        const startup = await this.startupService.findOne(evaluation.evaluated);
        return startup.item['nombre'];
      case ValidRoles.teamCoach:
        const teamCoach = await this.usersService.findById(
          evaluation.evaluated,
        );
        return teamCoach.fullName;
      case ValidRoles.expert:
        const expert = await this.expertService.findOne(evaluation.evaluated);
        return expert.item['nombre'];
      default:
        return '';
    }
  }
}
