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
import { ActaService } from './acta/acta.service';
import { infoWeekDates } from 'src/shared/utilities/dates.utilities';
import { Acta } from './acta/entities/acta.entity';
import { ConfigNotificationsService } from 'src/notifications/config-notifications/config-notifications.service';
import { default_notification_types } from 'src/notifications/types-notifications/model/types-notification.default';
import { EmailNotificationTypes } from 'src/notifications/types-notifications/model/email-notification-types.enum';
import { Notification as NotificationEntity } from 'src/notifications/entities/notification.entity';
import { NotificationStates } from 'src/notifications/enum/notification-states.enum';
import { NotificationTypes } from 'src/notifications/enum/notification-types.enum';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ParticipationEvent } from './participation-events/entities/participation-event.entity';
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
    @Inject(forwardRef(() => ActaService))
    private readonly actaService: ActaService,
    @Inject(forwardRef(() => ConfigNotificationsService))
    private readonly configNotificationsService: ConfigNotificationsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * create event
   */
  async create(createEventInput: CreateEventInput) {
    if (createEventInput.attendanceType === 'zoom') {
      return this.createEventAndZoom(createEventInput);
    } else {
      return this.createEventNormal(createEventInput);
    }
  }

  /**
   * create event with zoom instance, send email and more
   */
  async createEventAndZoom(createEventInput: CreateEventInput) {
    const hosting = [];
    const participants = [];
    const participantsId = [];
    const to = [];

    const notificationType = default_notification_types.find(
      (t) => t.type == EmailNotificationTypes.invitationToEvent,
    );
    const notificationsConfig =
      await this.configNotificationsService.findByType(
        notificationType._id.toString(),
      );

    for (const iterator of createEventInput.experts) {
      hosting.push({ email: iterator.email, name: iterator.name });
      to.push(iterator.email);
    }
    for (const iterator of createEventInput.teamCoaches) {
      hosting.push({ email: iterator.email, name: iterator.name });
      to.push(iterator.email);
    }
    for (const iterator of createEventInput.participants) {
      if (
        notificationsConfig.excluded.some(
          (userEmail) => userEmail == iterator.email,
        )
      )
        continue;
      participants.push({ email: iterator.email });
      to.push(iterator.email);
      participantsId.push(iterator._id);
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
    const defaultEmail = process.env.SEND_GRID_DEFAULT_VERIFIED_EMAIL;
    const splittedName = defaultEmail.split('@');
    await this.emailsService.sendIcs(
      {
        to: to,
        subject: `Has sido invitado a ${createEventInput.name}`,
        text: 'Nuevo evento agendado',
        html: `<p>Se ha agendado un proximo evento de zoom en ecosystem, se llama ${createEventInput.name}, puedes ingresar desde la app, o aquí tienes el <a href="${createdMeeting.join_url}">link</a> para el dia del evento  </p>`,
      },
      eventCreated.toObject(),
      {
        nameOrganizer: hosting[0] ? hosting[0].name : splittedName[0],
        emailOrganizer: hosting[0] ? hosting[0].email : defaultEmail,
        urlRedirect: this.configService.get('appUri'),
      },
    );
    this.sendNotificationDB(
      participantsId,
      createEventInput.experts.map((i) => i._id),
      createEventInput.teamCoaches.map((i) => i._id),
      eventCreated,
      'creation',
    );
    return eventCreated;
  }

  /**
   * create simple event
   */
  async createEventNormal(createEventInput: CreateEventInput) {
    const hosting = [];
    const participants = [];
    const participantsId = [];
    const to = [];

    const notificationType = default_notification_types.find(
      (t) => t.type == EmailNotificationTypes.invitationToEvent,
    );
    const notificationsConfig =
      await this.configNotificationsService.findByType(
        notificationType._id.toString(),
      );

    for (const iterator of createEventInput.experts) {
      hosting.push({ email: iterator.email, name: iterator.name });
      to.push(iterator.email);
    }
    for (const iterator of createEventInput.teamCoaches) {
      hosting.push({ email: iterator.email, name: iterator.name });
      to.push(iterator.email);
    }
    for (const iterator of createEventInput.participants) {
      if (
        notificationsConfig.excluded.some(
          (userEmail) => userEmail == iterator.email,
        )
      )
        continue;
      participants.push({ email: iterator.email });
      to.push(iterator.email);
      participantsId.push(iterator._id);
    }
    var startTime = new Date(createEventInput.startAt);
    var endTime = new Date(createEventInput.endAt);
    var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
    var resultInMinutes = Math.round(difference / 60000);

    const eventCreated = await this.eventModel.create({
      ...createEventInput,
      extra_options: {
        ...createEventInput.extra_options,
      },
    });
    const defaultEmail = process.env.SEND_GRID_DEFAULT_VERIFIED_EMAIL;
    const splittedName = defaultEmail.split('@');
    await this.emailsService.sendIcs(
      {
        to: to,
        subject: `Has sido invitado a ${createEventInput.name}`,
        text: 'Nuevo evento agendado',
        html: `<p>Se ha agendado un proximo evento en ecosystem, se llama ${
          createEventInput.name
        }, puedes ingresar desde la  <a href="${this.configService.get(
          'appUri',
        )}">app en calendario</a> </p> para mas detalles`,
      },
      eventCreated.toObject(),
      {
        nameOrganizer: hosting[0] ? hosting[0].name : splittedName[0],
        emailOrganizer: hosting[0] ? hosting[0].email : defaultEmail,
        urlRedirect: this.configService.get('appUri'),
      },
    );
    this.sendNotificationDB(
      participantsId,
      createEventInput.experts.map((i) => i._id),
      createEventInput.teamCoaches.map((i) => i._id),
      eventCreated,
      'creation',
    );
    return eventCreated;
  }

  /**
   * fin all events
   */
  findAll() {
    return this.eventModel.find({});
  }

  /**
   * find events for user
   */
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
        filters['teamCoaches._id'] = user._id.toString();
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

  /**
   * find events by batch
   */
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

  /**
   * find event by id
   */
  findOne(id: string) {
    return this.eventModel.findById(id);
  }

  /**
   * update event
   */
  async update(id: string, updateEventInput: UpdateEventInput) {
    delete updateEventInput['_id'];
    const updatedEvent: EventEntity = await this.eventModel
      .findOneAndUpdate({ _id: id }, { ...updateEventInput }, { new: true })
      .lean();
    if (updateEventInput.isCanceled) {
      await this.cancelEventEmail(updatedEvent);
    }
    if (
      updateEventInput?.extra_options &&
      updateEventInput.extra_options['editedDates'] &&
      !updateEventInput.isCanceled
    ) {
      await this.changeEventEmail(updatedEvent);
      const notificationType = default_notification_types.find(
        (t) => t.type == EmailNotificationTypes.invitationToEvent,
      );
      const notificationsConfig =
        await this.configNotificationsService.findByType(
          notificationType._id.toString(),
        );
      const participantsId = [];
      for (const iterator of updatedEvent.participants) {
        if (
          notificationsConfig.excluded.some(
            (userEmail) => userEmail == iterator.email,
          )
        )
          continue;
        participantsId.push(iterator._id);
      }
      this.sendNotificationDB(
        participantsId,
        updatedEvent.experts.map((i) => i._id.toString()),
        updatedEvent.teamCoaches.map((i) => i._id.toString()),
        updatedEvent,
        'update',
      );
    }
    return updatedEvent;
  }

  /**
   * soft delete event, and notify all participant of delete
   */
  async remove(id: string) {
    const updatedType: EventEntity = await this.eventModel
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    if (updatedType.attendanceType === 'zoom' && !updatedType.isCanceled) {
      await this.integrationsService.deleteMeeting(
        updatedType.extra_options.zoom['id'],
      );
    }
    if (!updatedType.isCanceled) {
      const notificationType = default_notification_types.find(
        (t) => t.type == EmailNotificationTypes.invitationToEvent,
      );
      const notificationsConfig =
        await this.configNotificationsService.findByType(
          notificationType._id.toString(),
        );
      const participantsId = [];
      for (const iterator of updatedType.participants) {
        if (
          notificationsConfig.excluded.some(
            (userEmail) => userEmail == iterator.email,
          )
        )
          continue;
        participantsId.push(iterator._id);
      }
      this.sendNotificationDB(
        participantsId,
        updatedType.experts.map((i) => i._id.toString()),
        updatedType.teamCoaches.map((i) => i._id.toString()),
        updatedType,
        'delete',
      );
      await this.cancelEventEmail(updatedType);
    }

    return updatedType;
  }

  /**
   * cancel event, and notify all participant of cancel
   */
  async cancelEventEmail(updatedEvent: EventEntity) {
    const hosting = [];
    const participants = [];
    const participantsId = [];
    const to = [];

    const notificationType = default_notification_types.find(
      (t) => t.type == EmailNotificationTypes.eventUpdate,
    );
    const notificationsConfig =
      await this.configNotificationsService.findByType(
        notificationType._id.toString(),
      );

    for (const iterator of updatedEvent.experts) {
      hosting.push({ email: iterator.email, name: iterator.name });
      to.push(iterator.email);
    }
    for (const iterator of updatedEvent.teamCoaches) {
      hosting.push({ email: iterator.email, name: iterator.name });
      to.push(iterator.email);
    }
    for (const iterator of updatedEvent.participants) {
      if (
        notificationsConfig.excluded.some(
          (userEmail) => userEmail == iterator.email,
        )
      )
        continue;
      participants.push({ email: iterator.email });
      to.push(iterator.email);
      participantsId.push(iterator._id);
    }
    var startTime = new Date(updatedEvent.startAt);
    var endTime = new Date(updatedEvent.endAt);
    var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
    var resultInMinutes = Math.round(difference / 60000);
    await this.emailsService.sendIcs(
      {
        to: to,
        subject: `El evento ${updatedEvent.name} ha sido cancelado`,
        text: 'Evento cancelado',
        html: `<p>Se ha cancelado un proximo evento en ecosystem, se llama ${updatedEvent.name}, eliminarlo de tu agenda si es el caso.`,
      },
      updatedEvent,
      {
        nameOrganizer: hosting[0].name,
        emailOrganizer: hosting[0].email,
        urlRedirect: this.configService.get('appUri'),
      },
    );
    this.sendNotificationDB(
      participantsId,
      updatedEvent.experts.map((i) => i._id),
      updatedEvent.teamCoaches.map((i) => i._id),
      updatedEvent,
      'delete',
    );
    return updatedEvent;
  }

  /**
   * notify all participant of changes in event
   */
  async changeEventEmail(updatedEvent: EventEntity) {
    const hosting = [];
    const participants = [];
    const to = [];

    const notificationType = default_notification_types.find(
      (t) => t.type == EmailNotificationTypes.eventUpdate,
    );
    const notificationsConfig =
      await this.configNotificationsService.findByType(
        notificationType._id.toString(),
      );

    for (const iterator of updatedEvent.experts) {
      hosting.push({ email: iterator.email, name: iterator.name });
      to.push(iterator.email);
    }
    for (const iterator of updatedEvent.teamCoaches) {
      hosting.push({ email: iterator.email, name: iterator.name });
      to.push(iterator.email);
    }
    for (const iterator of updatedEvent.participants) {
      if (
        notificationsConfig.excluded.some(
          (userEmail) => userEmail == iterator.email,
        )
      )
        continue;
      participants.push({ email: iterator.email });
      to.push(iterator.email);
    }
    var startTime = new Date(updatedEvent.startAt);
    var endTime = new Date(updatedEvent.endAt);
    var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
    var resultInMinutes = Math.round(difference / 60000);
    await this.emailsService.sendIcs(
      {
        to: to,
        subject: `El evento ${updatedEvent.name} ha sido modificado`,
        text: 'Evento modificado',
        html: `<p>Se ha modificado las fechas de un proximo evento en ecosystem, se llama ${updatedEvent.name}, re-agendarlo en tu agenda si es el caso.`,
      },
      updatedEvent,
      {
        nameOrganizer: hosting[0].name,
        emailOrganizer: hosting[0].email,
        urlRedirect: this.configService.get('appUri'),
      },
    );
    return updatedEvent;
  }

  /**
   * get participant list of a event
   */
  async getParticipation(event: EventEntity) {
    return await this.participationService.findByEvent(event._id);
  }

  /**
   * data for table dashboard of expert hours done
   */
  async registersExpert(user: AuthUser) {
    const docExpert = await this.expertService.findByAccount(user.uid);
    const idAsString = docExpert._id.toString();
    let dates = infoWeekDates();
    let labels = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    let countHoursDone = 0;
    let countHoursDonated = 0;
    let hoursWeeks = [];

    for (const date of dates.fechasSemana) {
      const begin = new Date(`${date}T00:00:00.000Z`);
      const end = new Date(`${date}T23:59:59.999Z`);
      const events = await this.eventModel
        .find({
          'experts._id': idAsString,
          isCanceled: false,
          isDeleted: false,
          endAt: {
            $gte: begin,
            $lt: end,
          },
        })
        .lean();
      const actas = await this.actaService
        .findByEventsList(events.map((i) => i._id.toString()))
        .lean();
      let countsHoursInDay = 0;
      for (const acta of actas) {
        if (!acta.extra_options?.expertHours[idAsString]) continue;
        countsHoursInDay += acta.extra_options.expertHours[idAsString].done;
        countHoursDone += acta.extra_options.expertHours[idAsString].done;
        countHoursDonated += acta.extra_options.expertHours[idAsString].donated;
      }
      hoursWeeks.push(countsHoursInDay);
    }
    return {
      labels,
      data: hoursWeeks,
      dateLabels: dates,
      countHoursDone,
      countHoursDonated,
    };
  }

  /**
   * data of expert hours done
   */
  async getRegistersHorus(expertId: string) {
    const events = await this.eventModel
      .find({
        'experts._id': new Types.ObjectId(expertId),
        isCanceled: false,
        isDeleted: false,
      })
      .lean();
    const actas = await this.actaService
      .findByEventsList(events.map((i) => i._id.toString()))
      .lean();
    let countHoursDone = 0;
    let countHoursDonated = 0;
    for (const acta of actas) {
      if (!acta.extra_options?.expertHours[expertId]) continue;
      countHoursDone += acta.extra_options.expertHours[expertId].done;
      countHoursDonated += acta.extra_options.expertHours[expertId].donated;
    }
    return { countHoursDone, countHoursDonated };
  }

  /**
   * hours consumed by startup in batch
   */
  async getConsumedHours(startup: string, batch: string) {
    const events = await this.eventModel
      .find({
        batch: new Types.ObjectId(batch),
        'participants.startupEntrepreneur': startup,
        isCanceled: false,
        isDeleted: false,
      })
      .lean();

    const actas = await this.actaService
      .findByEventsList(events.map((i) => i._id.toString()))
      .lean();

    let acc = {};
    for (const acta of actas) {
      if (
        !acta.extra_options?.expertHours ||
        Object.keys(acta.extra_options?.expertHours).length == 0
      )
        continue;
      const event = events.filter(
        (e) => e._id.toString() === acta.event.toString(),
      );
      Object.values(acta.extra_options.expertHours).forEach((element: any) => {
        if (!acc[event[0].type]) {
          acc[event[0].type] = element.done + element.donated;
        } else {
          acc[event[0].type] += element.done + element.donated;
        }
      });
    }
    return { hours: acc };
  }

  /**
   * get list of event and actas
   */
  async getEventsAndActas(phase: string) {
    const events: EventEntity[] = await this.eventModel
      .find({
        batch: new Types.ObjectId(phase),
        isCanceled: false,
        isDeleted: false,
      })
      .lean();
    const actas: Acta[] = await this.actaService
      .findByEventsList(events.map((i) => i._id.toString()))
      .lean();
    const participation: ParticipationEvent[] =
      await this.participationService.findByEvents(events.map((i) => i._id));
    return { events, actas, participation };
  }

  /**
   * order data of hours done by expert, only set
   */
  getExpertHours(actas: Acta[], expertId: string) {
    let countHoursDone = 0;
    let countHoursDonated = 0;
    for (const acta of actas) {
      if (!acta.extra_options?.expertHours[expertId]) continue;
      countHoursDone += acta.extra_options.expertHours[expertId].done;
      countHoursDonated += acta.extra_options.expertHours[expertId].donated;
    }
    return { countHoursDone, countHoursDonated };
  }

  /**
   * send notifications to participants by event
   */
  async sendNotificationDB(
    participantsId: string[],
    experts: string[],
    teamCoach: string[],
    event,
    type: 'creation' | 'update' | 'delete',
  ) {
    const entrepreneursDocs =
      await this.entrepreneurService.findMany(participantsId);
    const expertsDoc = await this.expertService.findMany(experts);
    const users = await this.usersService.findManyByUUID([
      ...entrepreneursDocs.filter((i) => i.accountId).map((i) => i.accountId),
      ...expertsDoc.filter((i) => i.accountId).map((i) => i.accountId),
    ]);
    const notificationList = [];
    for (const iterator of users) {
      const notification = this.buildNotification(
        type,
        iterator._id.toString(),
        event,
      );
      notificationList.push(notification);
    }
    for (const iterator of teamCoach) {
      const notification = this.buildNotification(type, iterator, event);
      notificationList.push(notification);
    }
    return this.notificationsService.createMany(notificationList);
  }

  /**
   * instance build notification
   */
  buildNotification(
    type: 'creation' | 'update' | 'delete',
    accountId: string,
    event: EventEntity,
  ) {
    let text = `Estas en el evento ${event.name}`;
    switch (type) {
      case 'creation':
        text = `Tienes un nuevo evento llamado ${event.name}, míralo ahora en tu agenda`;
        break;
      case 'update':
        text = `El evento ${event.name} ha sido modificado`;
        break;
      case 'delete':
        text = `El evento ${event.name} ha sido cancelado`;
        break;
      default:
        break;
    }
    const urlInvitation = process.env.APP_URI + '/home/calendar';
    return {
      text,
      date: new Date(),
      target: `userNotification ${accountId};`,
      state: NotificationStates.pending,
      type: NotificationTypes.calendar,
      isDeleted: false,
      url: urlInvitation,
    };
  }
}
