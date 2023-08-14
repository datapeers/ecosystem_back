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
import { AuthUser } from 'src/auth/types/auth-user';
import { ResourcesService } from '../resources.service';
import { StartupService } from 'src/startup/startup.service';
import { Startup } from 'src/startup/entities/startup.entity';
import { Resource } from '../entities/resource.entity';
import { Content } from 'src/content/entities/content.entity';
import { ContentService } from 'src/content/content.service';
import { ResourceType } from '../enums/resources-types';
import { ResourceReplyState } from './models/resorce-reply-statets';

@Injectable()
export class ResourcesRepliesService {
  constructor(
    @InjectModel(ResourcesReply.name)
    private readonly resourceReplyModel: Model<ResourcesReply>,
    @Inject(forwardRef(() => ResourcesService))
    private readonly resourceService: ResourcesService,
    @Inject(forwardRef(() => StartupService))
    private readonly startupService: StartupService,
    @Inject(forwardRef(() => ContentService))
    private readonly contentService: ContentService,
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
    return this.findOne(createdEvaluation._id);
  }

  findAll() {
    return this.resourceReplyModel
      .find({ isDeleted: false })
      .populate('startup')
      .populate('resource')
      .lean();
  }

  async findOne(id: string): Promise<ResourcesReply> {
    const resourceReply = await this.resourceReplyModel
      .findById(id)
      .populate('startup')
      .populate('resource')
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
      .lean();
    return updatedReply;
  }

  async remove(id: string) {
    const updatedReply = await this.resourceReplyModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .populate('startup')
      .populate('resource')
      .lean();
    return updatedReply;
  }

  async findByResource(resourceID: string, sprintID: string, user: AuthUser) {
    const resource = await this.resourceService.findOne(resourceID);
    const sprint = await this.contentService.findById(sprintID);
    const replies = await this.resourceReplyModel
      .find({
        resource: resource._id.toString(),
      })
      .lean();
    // console.log(replies);
    let ansList: ResourcesReply[] = [];
    const startupList = await this.startupService.findByPhase(
      resource.phase.toString(),
      user,
    );
    for (const startup of startupList) {
      let reply = replies.find(
        (i) => i.startup.toString() === startup._id.toString(),
      );
      if (!reply) reply = this.createSimpleReply(startup, resource, sprint);
      ansList.push({
        ...reply,
        resource: resource as any,
        startup: startup as any,
        sprint: sprint as any,
      });
    }
    return ansList;
  }

  createSimpleReply(startup: Startup, resource: Resource, sprint: Content) {
    const newReply = new ResourcesReply();
    newReply._id = new Types.ObjectId().toString();
    newReply.item = {} as any;
    newReply.type = resource.type;
    newReply.observations = '';
    newReply.startup = startup as any;
    newReply.sprint = sprint as any;
    newReply.createdAt = new Date();
    newReply.updatedAt = new Date();
    newReply.isDeleted = false;
    switch (resource.type) {
      case ResourceType.downloadable:
        newReply.state = ResourceReplyState['Sin descargar'];
        break;
      default:
        newReply.state = ResourceReplyState.Pendiente;
        break;
    }
    return newReply;
  }

  async findByStartup(startupID: string, phaseID: string) {
    return this.resourceReplyModel
      .find({
        startup: new Types.ObjectId(startupID),
        phase: new Types.ObjectId(phaseID),
      })
      .populate('startup')
      .populate('resource')
      .lean();
  }
}
