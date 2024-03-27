import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateActivitiesConfigInput } from './dto/create-activities-config.input';
import { UpdateActivitiesConfigInput } from './dto/update-activities-config.input';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { ActivitiesConfig } from './entities/activities-config.entity';
import { default_types_events } from 'src/events/types-events/model/type-events.default';
import { ExpertService } from 'src/expert/expert.service';
import { StartupService } from 'src/startup/startup.service';
import {
  Assign_item,
  IConfigExpert,
  IConfigStartup,
  IConfigTeamCoach,
} from './model/assign-item';
import { UsersService } from 'src/users/users.service';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { TypesEventsService } from 'src/events/types-events/types-events.service';
import { TypesEvent } from 'src/events/types-events/entities/types-event.entity';
import { Startup } from 'src/startup/entities/startup.entity';
import { Expert } from 'src/expert/entities/expert.entity';
import { User } from 'src/users/entities/user.entity';
import { EventsService } from 'src/events/events.service';
import { Acta } from 'src/events/acta/entities/acta.entity';
import { Event as EventEntity } from 'src/events/entities/event.entity';
import { ParticipationEvent } from 'src/events/participation-events/entities/participation-event.entity';
import {
  getTimeBetweenDates,
  timeRegister,
} from 'src/shared/utilities/dates.utilities';

@Injectable()
export class ActivitiesConfigService {
  activitiesForTeamCoach = ['646f953cc2305c411d73f700'];
  constructor(
    @InjectModel(ActivitiesConfig.name)
    private readonly activitiesConfig: Model<ActivitiesConfig>,
    @Inject(forwardRef(() => ExpertService))
    private readonly expertsService: ExpertService,
    @Inject(forwardRef(() => StartupService))
    private readonly startupsService: StartupService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => EventsService))
    private readonly eventsService: EventsService,
    @Inject(forwardRef(() => TypesEventsService))
    private readonly typesEventsService: TypesEventsService,
    @InjectConnection() private connection: Connection,
  ) {}

  /**
   * @returns Create new activity config for batch
   */
  create(createActivitiesConfigInput: CreateActivitiesConfigInput) {
    return this.activitiesConfig.create(createActivitiesConfigInput);
  }

  /**
   * search activity config by batch id
   * @returns activity config for batch
   */
  async findByPhase(phase: string) {
    let config = await this.activitiesConfig.findOne({ phase }).lean();
    if (!config) {
      config = await this.create({
        limit: 0,
        phase,
      });
    }
    return config;
  }

  /**
   * search activity config by batch id and startup and find the hours allocated to that startup
   * @returns hours allocated to that startup
   */
  async findByPhaseAndStartup(phase: string, startup: string) {
    let item = await this.activitiesConfig.findOne({ phase }).lean();
    if (!item) {
      item = await this.create({
        limit: 0,
        phase,
      });
    }

    const hoursTarget = await this.calcHours(item);

    const startupConfig = hoursTarget.hoursAssignStartups.filter(
      (s) => s._id.toString() == startup.toString(),
    );

    if (startupConfig.length == 0) return { hours: {} };

    let hoursConsumend: any = {};

    try {
      hoursConsumend = await this.eventsService.getConsumedHours(
        startup,
        phase,
      );
    } catch (error) {}

    const ans = {};

    Object.keys(startupConfig[0].hours).forEach((k) => {
      ans[k] = {
        target: startupConfig[0].hours[k],
        value:
          hoursConsumend.hours && hoursConsumend.hours[k]
            ? hoursConsumend.hours && hoursConsumend.hours[k]
            : 0,
      };
    });

    return { hours: ans };
  }

  /**
   * search activity config by id
   * @returns activity config
   */
  findOne(id: string) {
    return this.activitiesConfig.findById(id).lean();
  }

  /**
   * update params of activity config by batch id
   * @returns activity config updated
   */
  update(id: string, updateActivitiesConfigInput: UpdateActivitiesConfigInput) {
    delete updateActivitiesConfigInput['_id'];
    const updated = this.activitiesConfig
      .findOneAndUpdate(
        { _id: id },
        { ...updateActivitiesConfigInput },
        { new: true },
      )
      .lean();
    return updated;
  }

  /**
   * soft delete of activity config by batch id
   * @returns activity config updated
   */
  async remove(id: string) {
    const updatedContent = await this.activitiesConfig
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    return updatedContent;
  }

  /**
   * clone activity config by batch id and assign new batch
   * @returns activity config
   */
  async duplicate(id: string, newPhaseID: string) {
    const config = await this.findByPhase(id);
    delete config['_id'];
    return this.activitiesConfig.create({ ...config, phase: newPhaseID });
  }

  /**
   * the current configuration of hours assigned to startups, experts and team coaches
   * @returns hours allocated in startups, experts, team coaches
   */
  async calcHours(config: ActivitiesConfig): Promise<{
    hoursAssignStartups: IConfigStartup[];
    hoursAssignExperts: IConfigExpert[];
    hoursAssignTeamCoaches: IConfigTeamCoach[];
    events: EventEntity[];
    actas: Acta[];
    listParticipation: ParticipationEvent[];
    listActivities: TypesEvent[];
  }> {
    const listStartups = await this.startupsService.findByPhase(
      config.phase.toString(),
    );
    const listExperts = await this.expertsService.findByPhase(
      config.phase.toString(),
    );
    const listTeamCoach = await this.usersService.findMany({
      roles: [ValidRoles.teamCoach],
      relationsAssign: { batches: config.phase.toString() },
    });
    const { events, actas, participation } =
      await this.eventsService.getEventsAndActas(config.phase);
    const listActivities = await this.typesEventsService.findAll();
    const hoursAssignStartups = await this.calcHoursStartups(
      config,
      listActivities,
      listStartups,
    );

    const hoursAssignExperts = this.calcHoursExpert(
      config,
      listActivities,
      listExperts,
      listStartups,
      events,
      actas,
    );
    const hoursAssignTeamCoaches = this.calcHoursTeamCoach(
      config,
      listActivities,
      listTeamCoach,
      listStartups,
    );
    return {
      hoursAssignStartups,
      hoursAssignExperts,
      hoursAssignTeamCoaches,
      events,
      actas,
      listParticipation: participation,
      listActivities,
    };
  }

  /**
   * the current configuration of hours assigned to startups
   * @returns hours allocated in startups
   */
  async calcHoursStartups(
    config: ActivitiesConfig,
    listActivities: TypesEvent[],
    listStartups: Startup[],
  ): Promise<IConfigStartup[]> {
    let hoursAssignStartups: { [key: string]: IConfigStartup } = {};
    listStartups.forEach(
      (i) => (hoursAssignStartups[i._id] = { ...i, hours: {} }),
    );
    for (const activity of listActivities) {
      let hoursBagForActivity = config.activities.find(
        (i) => i.id === activity._id.toString(),
      );
      if (!hoursBagForActivity) continue; // means that if the activity is not found it is deleted and we must avoid it.
      let limitHoursIts = hoursBagForActivity.limit;
      let numbOfStartupsWithoutAssign = 0;
      let startupsWithoutConfig = {}; // it should be a dictionary to save us in the next steps having to do a find()
      for (const startup of listStartups) {
        const previousConfig = config.startups.find(
          (i) =>
            i.entityID === startup._id.toString() &&
            i.activityID === activity._id.toString(),
        );
        if (previousConfig) {
          limitHoursIts -= previousConfig.limit;
          hoursAssignStartups[startup._id].hours[activity._id] =
            previousConfig.limit;
        } else {
          numbOfStartupsWithoutAssign++;
          startupsWithoutConfig[startup._id] = true;
        }
      }
      let hoursEach = this.getHoursForOthers(
        limitHoursIts,
        Object.keys(startupsWithoutConfig).length,
      );

      for (const startupId of Object.keys(startupsWithoutConfig)) {
        if (limitHoursIts === 0) hoursEach = 0;
        limitHoursIts -= hoursEach;
        hoursAssignStartups[startupId].hours[activity._id] = hoursEach;
      }
    }
    return Object.values(hoursAssignStartups);
  }

  /**
   * @ignore
   */
  getHoursForOthers(limit: number, pending: number) {
    let hoursForOthersStartups = Math.round(limit / pending);
    if (hoursForOthersStartups < 1) return 1;
    return hoursForOthersStartups;
  }

  /**
   * the current configuration of hours assigned to experts
   * @returns hours allocated in experts
   */
  calcHoursExpert(
    config: ActivitiesConfig,
    listActivities: TypesEvent[],
    listExpert: Expert[],
    listStartups: Startup[],
    events: EventEntity[],
    actas: Acta[],
  ): IConfigExpert[] {
    let hoursAssignExpert: { [key: string]: IConfigExpert } = {};
    listExpert.forEach(
      (i) => (hoursAssignExpert[i._id] = { ...i, hours: {}, startups: [] }),
    );
    const listActivitiesExpert = listActivities.filter((i) => i.expertFocus);
    // Assign activities to expert
    for (const activity of listActivitiesExpert) {
      if (activity.isDeleted) continue; // means that if the activity is not found it is deleted and we must avoid it.
      const eventsActivity = events.filter(
        (i) => !(i.type === activity._id.toString()),
      );
      for (const expert of listExpert) {
        const previousConfig = config.experts.find(
          (i) =>
            i.entityID === expert._id.toString() &&
            i.activityID === activity._id.toString(),
        );
        const eventsExpert = eventsActivity.filter((i) =>
          i.experts.find((i) => i._id === expert._id.toString()),
        );
        const actasExpert = [];
        for (const event of eventsExpert) {
          const acta = actas.find(
            (i) => i.event.toString() === event._id.toString(),
          );
          if (!acta) continue;
          actasExpert.push(acta);
        }
        const { countHoursDone, countHoursDonated } =
          this.eventsService.getExpertHours(actasExpert, expert._id.toString());
        hoursAssignExpert[expert._id].hours[activity._id] = {
          allocated: previousConfig ? previousConfig.limit : 0,
          donated: countHoursDonated,
          done: countHoursDone,
        };
      }
    }

    // Assign startups expert
    for (const expert of listExpert) {
      const profilePhase = expert.phases.find(
        (i) => i._id.toString() === config.phase.toString(),
      );
      for (const startup of profilePhase.startUps) {
        const docStartup = listStartups.find(
          (i) => i._id.toString() === startup._id,
        );
        if (!docStartup) continue;
        hoursAssignExpert[expert._id].startups.push({
          ...docStartup,
        });
      }
    }
    return Object.values(hoursAssignExpert);
  }

  /**
   * the current configuration of hours assigned to team coaches
   * @returns hours allocated in team coaches
   */
  calcHoursTeamCoach(
    config: ActivitiesConfig,
    listActivities: TypesEvent[],
    listTeamCoaches: User[],
    listStartups: Startup[],
  ): IConfigTeamCoach[] {
    let hoursAssignTeamCoaches: { [key: string]: IConfigTeamCoach } = {};
    listTeamCoaches.forEach(
      (i) =>
        (hoursAssignTeamCoaches[i._id] = {
          _id: i._id.toString(),
          item: {
            nombre: i.fullName,
          },
          hours: {},
          startups: [],
        }),
    );
    const listActivitiesTeamCoach = listActivities.filter((i) =>
      this.activitiesForTeamCoach.includes(i._id.toString()),
    );

    // Assign activities to expert
    for (const activity of listActivitiesTeamCoach) {
      if (activity.isDeleted) continue; // means that if the activity is not found it is deleted and we must avoid it.
      for (const teamCoach of listTeamCoaches) {
        const previousConfig = config.teamCoaches.find(
          (i) =>
            i.entityID === teamCoach._id.toString() &&
            i.activityID === activity._id.toString(),
        );
        if (previousConfig) {
          hoursAssignTeamCoaches[teamCoach._id].hours[activity._id] = {
            allocated: previousConfig.limit,
            done: 0,
          };
        } else {
          hoursAssignTeamCoaches[teamCoach._id].hours[activity._id] = {
            allocated: 0,
            done: 0,
          };
        }
      }
    }
    // Assign startups expert
    for (const teamCoach of listTeamCoaches) {
      for (const startup of teamCoach.relationsAssign.startups) {
        const docStartup = listStartups.find(
          (i) => i._id.toString() === startup._id,
        );
        if (!docStartup) continue;
        hoursAssignTeamCoaches[teamCoach._id].startups.push({
          ...docStartup,
        });
      }
    }
    return Object.values(hoursAssignTeamCoaches);
  }

  async generateViewHours(batchId: string) {
    const nameCollectionViewActivity = 'hours_bag_view';
    const config = await this.findByPhase(batchId);
    const batch = await this.connection
      .collection('phases')
      .findOne({ _id: new Types.ObjectId(batchId) as any });
    await this.connection
      .collection(nameCollectionViewActivity)
      .deleteMany({ IdBatch: batch._id });
    try {
      const calcHours = await this.calcHours(config);
      const docs: HourBagReportItem[] = [];
      // ---------------- Startups ---------------------------------------------------------
      for (const activity of calcHours.listActivities) {
        for (const startupConfig of calcHours.hoursAssignStartups) {
          const eventsDone = calcHours.events.filter(
            (event) =>
              event.type === activity._id.toString() &&
              event.participants.find(
                (entrepreneur) =>
                  entrepreneur.startupEntrepreneur ===
                  startupConfig._id.toString(),
              ),
          );

          const eventsHours = eventsDone.length
            ? eventsDone
                .map((event) => getTimeBetweenDates(event.startAt, event.endAt))
                .reduce((acc, item) => {
                  if (!acc) {
                    acc = item;
                  } else {
                    acc.add(item);
                  }
                  return acc;
                })
            : 0;
          docs.push({
            type: 'startup',
            IdBatch: batch._id,
            Batch: batch.name,
            IdActividad: activity._id,
            Actividad: activity.name,
            IdStartup: startupConfig._id,
            Startup: startupConfig.item['nombre'],
            LimiteStartup: startupConfig.hours[activity._id],
            StartupHoras: eventsHours ? eventsHours.formatear() : 0,
          });
        }
      }
      // ---------------- Experts -----------------------------------------------------------
      const listActivitiesExpert = calcHours.listActivities.filter(
        (i) => i.expertFocus,
      );
      for (const expertActivity of listActivitiesExpert) {
        for (const expertConfig of calcHours.hoursAssignExperts) {
          docs.push({
            type: 'expert',
            IdBatch: batch._id,
            Batch: batch.name,
            IdActividad: expertActivity._id,
            Actividad: expertActivity.name,
            IdExpert: expertConfig._id,
            Expert: expertConfig.item['nombre'],
            LimiteExpert: expertConfig.hours[expertActivity._id].allocated,
            ExpertHorasCompletadas: expertConfig.hours[expertActivity._id].done,
            ExpertHorasDonadas: expertConfig.hours[expertActivity._id].donated,
          });
        }
      }

      // -------------- Team Coaches
      const listActivitiesTeamCoach = calcHours.listActivities.filter((i) =>
        this.activitiesForTeamCoach.includes(i._id.toString()),
      );
      for (const activityTeamCoach of listActivitiesTeamCoach) {
        for (const teamCoachConfig of calcHours.hoursAssignTeamCoaches) {
          docs.push({
            type: 'teamCoach',
            IdBatch: batch._id,
            Batch: batch.name,
            IdActividad: activityTeamCoach._id,
            Actividad: activityTeamCoach.name,
            IdTeamCoach: teamCoachConfig._id,
            teamCoach: teamCoachConfig.item['nombre'],
            LimiteHorasTeamCoach:
              teamCoachConfig.hours[activityTeamCoach._id].allocated,
            TeamCoachHorasCompletadas:
              teamCoachConfig.hours[activityTeamCoach._id].done,
          });
        }
      }
      await this.connection
        .collection(nameCollectionViewActivity)
        .insertMany(docs);
      return config;
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      return config;
    }
  }
}

interface HourBagReportItem {
  type: 'startup' | 'expert' | 'teamCoach';
  IdBatch: any;
  Batch: string;
  IdActividad: string;
  Actividad: string;
  // expert
  IdExpert?: any;
  Expert?: string;
  ExpertHorasCompletadas?: any;
  ExpertHorasDonadas?: any;
  LimiteExpert?: any;
  // startup
  IdStartup?: any;
  Startup?: string;
  LimiteStartup?: any;
  StartupHoras?: any;
  // -- teamCoach
  IdTeamCoach?: any;
  teamCoach?: string;
  TeamCoachHorasCompletadas?: any;
  LimiteHorasTeamCoach?: any;
  // ----------
  IdEvento?: any;
  IdActa?: any;
}
