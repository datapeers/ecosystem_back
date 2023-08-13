import { CreateResourcesReplyInput } from './dto/create-resources-reply.input';
import { UpdateResourcesReplyInput } from './dto/update-resources-reply.input';
import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResourcesReply } from './entities/resources-reply.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class ResourcesRepliesService {
  constructor(
    @InjectModel(ResourcesReply.name)
    private readonly resourceReplyModel: Model<ResourcesReply>,
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

  async create(
    createResourcesReplyInput: CreateResourcesReplyInput,
  ): Promise<ResourcesReply> {
    const createdEvaluation = await this.resourceReplyModel.create(
      createResourcesReplyInput,
    );
    return createdEvaluation;
  }

  findAll() {
    return this.resourceReplyModel
      .find({ isDeleted: false })
      .populate('startup')
      .populate('resource')
      .populate('sprint')
      .lean();
  }

  async findOne(id: string): Promise<ResourcesReply> {
    const resourceReply = await this.resourceReplyModel
      .findById(id)
      .populate('startup')
      .populate('resource')
      .populate('sprint')
      .lean();
    if (!resourceReply)
      throw new NotFoundException(`Couldn't find resource reply with id ${id}`);
    return resourceReply;
  }

  async update(
    id: string,
    data: Partial<ResourcesReply>,
  ): Promise<ResourcesReply> {
    const evaluation = await this.resourceReplyModel
      .updateOne({ _id: id }, data, { new: true })
      .lean();
    return evaluation;
  }

  async updateDoc(
    id: string,
    updateResourcesReplyInput: UpdateResourcesReplyInput,
  ) {
    delete updateResourcesReplyInput['_id'];
    const updatedReply = await this.resourceReplyModel
      .findOneAndUpdate(
        { _id: id },
        { ...updateResourcesReplyInput },
        { new: true },
      )
      .populate('startup')
      .populate('resource')
      .populate('sprint')
      .lean();
    return updatedReply;
  }

  async remove(id: string) {
    const updatedReply = await this.resourceReplyModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .populate({ path: 'childs', populate: 'resources' })
      .populate('resources')
      .lean();
    return updatedReply;
  }
}
