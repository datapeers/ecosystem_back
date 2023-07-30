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
    const evaluations = await this.evaluationModel.find({
      config,
      isDeleted: false,
    });
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
    switch (configEvaluation.evaluated) {
      case ValidRoles.user:
        break;
      case ValidRoles.teamCoach:
        break;
      case ValidRoles.expert:
        break;
      default:
        return evaluations;
    }
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
    const evaluation = await this.evaluationModel
      .updateOne({ _id: id }, data, { new: true })
      .lean();
    return evaluation;
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
}
