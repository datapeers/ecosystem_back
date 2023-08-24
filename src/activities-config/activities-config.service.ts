import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateActivitiesConfigInput } from './dto/create-activities-config.input';
import { UpdateActivitiesConfigInput } from './dto/update-activities-config.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    @Inject(forwardRef(() => TypesEventsService))
    private readonly typesEventsService: TypesEventsService,
  ) {}

  create(createActivitiesConfigInput: CreateActivitiesConfigInput) {
    return this.activitiesConfig.create(createActivitiesConfigInput);
  }

  async findByPhase(phase: string) {
    let item = await this.activitiesConfig.findOne({ phase }).lean();
    if (!item) {
      item = await this.create({
        limit: 0,
        phase,
      });
    }
    return item;
  }

  findOne(id: string) {
    return this.activitiesConfig.findById(id).lean();
  }

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

  async remove(id: string) {
    const updatedContent = await this.activitiesConfig
      .findOneAndUpdate({ _id: id }, { isDeleted: true }, { new: true })
      .lean();
    return updatedContent;
  }

  async duplicate(id: string, newPhaseID: string) {
    const config = await this.findByPhase(id);
    delete config['_id'];
    return this.activitiesConfig.create({ ...config, phase: newPhaseID });
  }

  async calcHours(config: ActivitiesConfig) {
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
    };
  }

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

  getHoursForOthers(limit: number, pending: number) {
    let hoursForOthersStartups = Math.round(limit / pending);
    if (hoursForOthersStartups < 1) return 1;
    return hoursForOthersStartups;
  }

  calcHoursExpert(
    config: ActivitiesConfig,
    listActivities: TypesEvent[],
    listExpert: Expert[],
    listStartups: Startup[],
  ) {
    let hoursAssignExpert: { [key: string]: IConfigExpert } = {};
    listExpert.forEach(
      (i) => (hoursAssignExpert[i._id] = { ...i, hours: {}, startups: [] }),
    );
    const listActivitiesExpert = listActivities.filter((i) => i.expertFocus);

    // Assign activities to expert
    for (const activity of listActivitiesExpert) {
      let hoursBagForActivity = config.activities.find(
        (i) => i.id === activity._id.toString(),
      );
      if (!hoursBagForActivity) continue; // means that if the activity is not found it is deleted and we must avoid it.
      for (const expert of listExpert) {
        const previousConfig = config.experts.find(
          (i) =>
            i.entityID === expert._id.toString() &&
            i.activityID === activity._id.toString(),
        );
        if (previousConfig) {
          hoursAssignExpert[expert._id].hours[activity._id] = {
            allocated: previousConfig.limit,
            donated: 0,
            done: 0,
          };
        } else {
          hoursAssignExpert[expert._id].hours[activity._id] = {
            allocated: 0,
            donated: 0,
            done: 0,
          };
        }
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

  calcHoursTeamCoach(
    config: ActivitiesConfig,
    listActivities: TypesEvent[],
    listTeamCoaches: User[],
    listStartups: Startup[],
  ) {
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
      let hoursBagForActivity = config.activities.find(
        (i) => i.id === activity._id.toString(),
      );
      if (!hoursBagForActivity) continue; // means that if the activity is not found it is deleted and we must avoid it.
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
}
