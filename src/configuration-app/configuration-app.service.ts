import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UpdateConfigurationAppInput } from './dto/update-configuration-app.input';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigurationApp } from './entities/configuration-app.entity';
import { UserLogService } from 'src/user-log/user-log.service';
import { AuthUser } from '../auth/types/auth-user';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Injectable()
export class ConfigurationAppService {
  constructor(
    @InjectModel(ConfigurationApp.name)
    private readonly configurationApp: Model<ConfigurationApp>,
    @Inject(forwardRef(() => UserLogService))
    private readonly userLogService: UserLogService,
  ) {}

  async onModuleInit() {
    let types = await this.configurationApp.find({});
    if (types.length === 0) {
      await this.configurationApp.create({ dashboard: 'Dashboard here!' });
    }
  }

  async find() {
    return (await this.configurationApp.find())[0];
  }

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

  async initGraph(user: AuthUser) {
    let ans = {};
    switch (user.rolDoc.type) {
      case ValidRoles.user:
        break;
      case ValidRoles.expert:
        break;
      default:
        ans['dataGraph'] = await this.userLogService.getRegistersUsers();
        console.log(ans);
        break;
    }
    return ans;
  }
}
