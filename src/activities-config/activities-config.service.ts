import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateActivitiesConfigInput } from './dto/create-activities-config.input';
import { UpdateActivitiesConfigInput } from './dto/update-activities-config.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ActivitiesConfig,
  startUpHours,
} from './entities/activities-config.entity';
import { default_types_events } from 'src/events/types-events/model/type-events.default';
import { ExpertService } from 'src/expert/expert.service';
import { StartupService } from 'src/startup/startup.service';
import { Assign_item } from './model/assign-item';
import { UsersService } from 'src/users/users.service';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Injectable()
export class ActivitiesConfigService {
  constructor(
    @InjectModel(ActivitiesConfig.name)
    private readonly activitiesConfig: Model<ActivitiesConfig>,
    @Inject(forwardRef(() => ExpertService))
    private readonly expertsService: ExpertService,
    @Inject(forwardRef(() => StartupService))
    private readonly startupsService: StartupService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
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

  async calcExpertsHours(config: ActivitiesConfig) {
    let totalActivitiesHours = 0;
    let limitTeamCoachHours = 0;
    for (const configActivity of config.activities) {
      totalActivitiesHours += configActivity.limit;
      if (configActivity.idActivity === '646f953cc2305c411d73f700')
        limitTeamCoachHours = configActivity.limit ?? 0;
    }
    let expertHours = totalActivitiesHours - limitTeamCoachHours;
    const listExperts = await this.expertsService.findByPhase(
      config.phase.toString(),
    );
    const listStartups = await this.startupsService.findByPhase(
      config.phase.toString(),
    );
    let ans: Assign_item[] = [];
    let numbOfExpertWithoutAssign = 0;
    let hoursLeftToOthersExperts = listExperts.length
      ? Math.round(expertHours / listExperts.length)
      : 0;
    for (const expert of listExperts) {
      const previousConfig = config.experts.find(
        (i) => i.from === expert._id.toString(),
      );
      if (previousConfig && previousConfig.limit !== hoursLeftToOthersExperts) {
        expertHours -= previousConfig.limit;
      } else {
        numbOfExpertWithoutAssign++;
      }
      const profilePhase = expert.phases.find(
        (i) => i._id.toString() === config.phase.toString(),
      );
      const item = new Assign_item(
        {
          from: expert._id.toString(),
          to: [],
          limit: previousConfig ? previousConfig.limit : 0,
        },
        expert.item['nombre'],
      );
      for (const startup of profilePhase.startUps) {
        const docStartup = listStartups.find(
          (i) => i._id.toString() === startup._id,
        );
        if (!docStartup) continue;
        const previousConfigStartup = config.startups.find(
          (i) =>
            i.id === startup._id && expert._id.toString() === i.from.toString(),
        );
        item.to.push({
          id: startup._id,
          limit: previousConfigStartup ? previousConfigStartup.limit : 0,
          name: docStartup.item['nombre'],
        });
      }
      ans.push(item);
    }
    hoursLeftToOthersExperts = this.getHoursForOthers(
      expertHours,
      numbOfExpertWithoutAssign ?? 1,
    );
    for (const expertAssign of ans) {
      if (!expertAssign.limit || expertAssign.limit === 0) {
        expertAssign.limit = hoursLeftToOthersExperts;
      }
      let hoursToStartups = expertAssign.limit;
      let numbOfStartups = 0;
      for (const startupAssign of expertAssign.to) {
        if (startupAssign.limit === 0) {
          numbOfStartups++;
        } else {
          hoursToStartups -= startupAssign.limit;
        }
      }
      const hoursByStartupWithoutAssign = this.getHoursForOthers(
        hoursToStartups,
        numbOfStartups ?? 1,
      );
      for (const startupAssign of expertAssign.to) {
        if (startupAssign.limit === 0)
          startupAssign.limit = hoursByStartupWithoutAssign;
      }
    }
    return {
      expertHours: totalActivitiesHours - limitTeamCoachHours,
      hoursLeftToOthersExperts,
      list: ans,
    };
  }

  async calcTeamCoachHours(config: ActivitiesConfig) {
    let configTeamCoachActivities = config.activities.find(
      (i) => i.idActivity === '646f953cc2305c411d73f700',
    );
    let teamCoachHours = configTeamCoachActivities?.limit ?? 0;

    const listTeamCoach = await this.usersService.findMany({
      roles: [ValidRoles.teamCoach],
      relationsAssign: { batches: config.phase.toString() },
    });
    const listStartups = await this.startupsService.findByPhase(
      config.phase.toString(),
    );
    let ans: Assign_item[] = [];
    let numbOfTeamCoachWithoutAssign = 0;
    let hoursLeftToOthersTeamCoaches = listTeamCoach.length
      ? Math.round(teamCoachHours / listTeamCoach.length)
      : 0;
    for (const teamCoach of listTeamCoach) {
      const previousConfig = config.teamCoaches.find(
        (i) => i.from === teamCoach._id.toString(),
      );
      if (
        previousConfig &&
        previousConfig.limit !== hoursLeftToOthersTeamCoaches
      ) {
        teamCoachHours -= previousConfig.limit;
      } else {
        numbOfTeamCoachWithoutAssign++;
      }
      const item = new Assign_item(
        {
          from: teamCoach._id.toString(),
          to: [],
          limit: previousConfig ? previousConfig.limit : 0,
        },
        teamCoach.fullName,
      );
      for (const startup of teamCoach.relationsAssign.startups) {
        const docStartup = listStartups.find(
          (i) => i._id.toString() === startup._id,
        );
        if (!docStartup) continue;
        const previousConfigStartup = config.startups.find(
          (i) =>
            i.id === startup._id &&
            teamCoach._id.toString() === i.from.toString(),
        );
        item.to.push({
          id: startup._id,
          limit: previousConfigStartup ? previousConfigStartup.limit : 0,
          name: docStartup.item['nombre'],
        });
      }
      ans.push(item);
    }
    hoursLeftToOthersTeamCoaches = this.getHoursForOthers(
      teamCoachHours,
      numbOfTeamCoachWithoutAssign ?? 1,
    );
    for (const teamCoachAssign of ans) {
      if (!teamCoachAssign.limit || teamCoachAssign.limit === 0) {
        teamCoachAssign.limit = hoursLeftToOthersTeamCoaches;
      }
      let hoursToStartups = teamCoachAssign.limit;
      let numbOfStartups = 0;
      for (const startupAssign of teamCoachAssign.to) {
        if (startupAssign.limit === 0) {
          numbOfStartups++;
        } else {
          hoursToStartups -= startupAssign.limit;
        }
      }
      const hoursByStartupWithoutAssign = this.getHoursForOthers(
        hoursToStartups,
        numbOfStartups ?? 1,
      );
      for (const startupAssign of teamCoachAssign.to) {
        if (startupAssign.limit === 0)
          startupAssign.limit = hoursByStartupWithoutAssign;
      }
    }
    return {
      teamCoachHours,
      hoursLeftToOthersTeamCoaches,
      list: ans,
    };
  }

  getHoursForOthers(limit: number, pending: number) {
    let hoursForOthersStartups = Math.round(limit / pending);
    if (hoursForOthersStartups * pending > limit) {
      return this.getHoursForOthers(limit - 1, pending);
    }
    return hoursForOthersStartups;
  }
}
