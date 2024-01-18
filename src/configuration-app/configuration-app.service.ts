import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UpdateConfigurationAppInput } from './dto/update-configuration-app.input';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigurationApp } from './entities/configuration-app.entity';
import { UserLogService } from 'src/user-log/user-log.service';
import { AuthUser } from '../auth/types/auth-user';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class ConfigurationAppService {
  constructor(
    @InjectModel(ConfigurationApp.name)
    private readonly configurationApp: Model<ConfigurationApp>,
    @Inject(forwardRef(() => UserLogService))
    private readonly userLogService: UserLogService,
    @Inject(forwardRef(() => EventsService))
    private readonly eventsService: EventsService,
  ) {}

  /**
   * initializes the app configuration
   */
  async onModuleInit() {
    let types = await this.configurationApp.find({});
    if (types.length === 0) {
      await this.configurationApp.create({ dashboard: 'Dashboard here!' });
    }
  }

  /**
   * find the app configuration
   */
  async find() {
    return (await this.configurationApp.find())[0];
  }

  /**
   * update the app configuration
   */
  async update(
    id: string,
    updateConfigurationAppInput: UpdateConfigurationAppInput,
  ) {
    delete updateConfigurationAppInput['_id'];
    const updatedStage = await this.configurationApp
      .findOneAndUpdate(
        { _id: id },
        { ...updateConfigurationAppInput },
        { new: true },
      )
      .lean();
    return updatedStage;
  }

  /**
   * search data graphs for dashboard
   */
  async initGraph(user: AuthUser) {
    let ans = {};
    switch (user.rolDoc.type) {
      case ValidRoles.user:
        ans = { ...(await this.userLogService.getUserRegisterWeek(user)) };
        break;
      case ValidRoles.expert:
        ans = { ...(await this.eventsService.registersExpert(user)) };
        break;
      default:
        ans = { ...(await this.userLogService.getRegistersUsers()) };
        break;
    }
    return ans;
  }
}
