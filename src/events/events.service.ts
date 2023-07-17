import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event as EventEntity } from './entities/event.entity';
import { AuthUser } from 'src/auth/types/auth-user';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { Permission, getPermissionList } from 'src/auth/enums/permissions.enum';
import { ExpertService } from 'src/expert/expert.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(EventEntity.name)
    private readonly eventModel: Model<Event>,
    @Inject(forwardRef(() => ExpertService))
    private readonly expertService: ExpertService,
  ) {}

  create(createEventInput: CreateEventInput) {
    return this.eventModel.create(createEventInput);
  }

  findAll() {
    return this.eventModel.find({});
  }

  async findByPhase(phase: string, user: AuthUser) {
    if (
      ValidRoles.teamCoach === user.rolDoc.type &&
      !getPermissionList(user).includes(Permission.load_all_events)
    ) {
      return this.eventModel.find({
        phase,
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
        phase,
        isDeleted: false,
        'experts._id': docExpert._id.toString(),
      });
    }
    return this.eventModel.find({ phase, isDeleted: false });
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
}
