import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event as EventEntity } from './entities/event.entity';
import { AuthUser } from 'src/auth/types/auth-user';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { Permission, getPermissionList } from 'src/auth/enums/permissions.enum';
import { ExpertService } from 'src/expert/expert.service';
import { StartupService } from 'src/startup/startup.service';
import { EntrepreneurService } from 'src/entrepreneur/entrepreneur.service';
import { PhasesService } from 'src/phases/phases.service';
import { ParticipationEventsService } from './participation-events/participation-events.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(EventEntity.name)
    private readonly eventModel: Model<Event>,
    @Inject(forwardRef(() => EntrepreneurService))
    private readonly entrepreneurService: EntrepreneurService,
    @Inject(forwardRef(() => ExpertService))
    private readonly expertService: ExpertService,
    @Inject(forwardRef(() => PhasesService))
    private readonly phasesService: PhasesService,
    @Inject(forwardRef(() => ParticipationEventsService))
    private readonly participationService: ParticipationEventsService,
  ) {}

  create(createEventInput: CreateEventInput) {
    return this.eventModel.create(createEventInput);
  }

  findAll() {
    return this.eventModel.find({});
  }

  async findByUser(user: AuthUser) {
    let filters = {};
    switch (user.rolDoc.type) {
      case ValidRoles.user:
        const docEntrepreneur = await this.entrepreneurService.findByAccount(
          user.uid,
        );
        if (!docEntrepreneur) return [];
        filters['participants._id'] = docEntrepreneur._id.toString();
        break;
      case ValidRoles.expert:
        const docExpert = await this.expertService.findByAccount(user.uid);
        if (!docExpert) return [];
        filters['experts._id'] = docExpert._id.toString();
        break;
      case ValidRoles.teamCoach:
        filters['teamCoach._id'] = user._id.toString();
        break;
      case ValidRoles.host:
        const listBatchesAccess =
          await this.phasesService.getAllBatchesAccessHost(user);
        filters['phase'] = {
          $in: listBatchesAccess,
        };
      default:
        break;
    }
    return this.eventModel.find({ isDeleted: false, ...filters });
  }

  async findByBatch(batch: string, user: AuthUser) {
    if (
      ValidRoles.teamCoach === user.rolDoc.type &&
      !getPermissionList(user).includes(Permission.load_all_events)
    ) {
      return this.eventModel.find({
        batch,
        isDeleted: false,
        'teamCoaches._id': user._id.toString(),
      });
    }
    if (
      ValidRoles.expert === user.rolDoc.type &&
      !getPermissionList(user).includes(Permission.load_all_events)
    ) {
      const docExpert = await this.expertService.findByAccount(user.uid);
      return this.eventModel.find({
        batch,
        isDeleted: false,
        'experts._id': docExpert._id.toString(),
      });
    }
    return this.eventModel.find({ batch, isDeleted: false });
  }

  findOne(id: string) {
    return this.eventModel.findById(id);
  }

  async update(id: string, updateEventInput: UpdateEventInput) {
    delete updateEventInput['_id'];
    const updatedEvent = await this.eventModel
      .findOneAndUpdate({ _id: id }, { ...updateEventInput }, { new: true })
      .lean();
    return updatedEvent;
  }

  async remove(id: string) {
    const updatedType = await this.eventModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    return updatedType;
  }

  async getParticipation(event: EventEntity) {
    return await this.participationService.findByEvent(event._id);
  }
}
