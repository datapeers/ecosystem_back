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
import { IntegrationsService } from 'src/integrations/integrations.service';
import { EmailsService } from 'src/emails/emails.service';
import { AppConfiguration } from 'config/app.config';
import { ConfigService } from '@nestjs/config';

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
    @Inject(forwardRef(() => IntegrationsService))
    private readonly integrationsService: IntegrationsService,
    @Inject(forwardRef(() => EmailsService))
    private readonly emailsService: EmailsService,
    private readonly configService: ConfigService<AppConfiguration>,
  ) {}

  async create(createEventInput: CreateEventInput) {
    if (createEventInput.attendanceType === 'zoom') {
      return this.createEventAndZoom(createEventInput);
    } else {
      return this.eventModel.create(createEventInput);
    }
  }

  async createEventAndZoom(createEventInput: CreateEventInput) {
    const hosting = [];
    const participants = [];
    const to = [];
    for (const iterator of createEventInput.experts) {
      hosting.push({ email: iterator.email, name: iterator.name });
      to.push(iterator.email);
    }
    for (const iterator of createEventInput.teamCoaches) {
      hosting.push({ email: iterator.email, name: iterator.name });
      to.push(iterator.email);
    }
    for (const iterator of createEventInput.participants) {
      participants.push({ email: iterator.email });
      to.push(iterator.email);
    }
    var startTime = new Date(createEventInput.startAt);
    var endTime = new Date(createEventInput.endAt);
    var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
    var resultInMinutes = Math.round(difference / 60000);
    const createdMeeting = await this.integrationsService.zoomMeeting(
      createEventInput.name
        .normalize('NFD')
        .replace(
          /([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,
          '$1',
        )
        .normalize(),
      createEventInput.startAt,
      resultInMinutes,
      hosting,
      participants,
    );
    const eventCreated = await this.eventModel.create({
      ...createEventInput,
      extra_options: {
        ...createEventInput.extra_options,
        zoom: createdMeeting,
      },
    });
    await this.emailsService.sendIcs(
      {
        to: to,
        subject: `Has sido invitado a ${createEventInput.name}`,
        text: 'Nuevo evento agendado',
        html: `<p>Se ha agendado un proximo evento de zoom en ecosystem, se llama ${createEventInput.name}, puedes ingresar desde la app, o aquí tienes el <a href="${createdMeeting.join_url}">Visit our homepage</a> para el dia del evento  </p>`,
      },
      eventCreated.toObject(),
      {
        nameOrganizer: hosting[0].name,
        emailOrganizer: hosting[0].email,
        urlRedirect: this.configService.get('appUri'),
      },
    );
    return eventCreated;
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
    const updatedType: EventEntity = await this.eventModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    if (updatedType.attendanceType === 'zoom') {
      await this.integrationsService.deleteMeeting(
        updatedType.extra_options.zoom['id'],
      );
    }
    return updatedType;
  }

  async getParticipation(event: EventEntity) {
    return await this.participationService.findByEvent(event._id);
  }
}
