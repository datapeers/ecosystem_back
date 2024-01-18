import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigNotificationsService } from 'src/notifications/config-notifications/config-notifications.service';
import { default_notification_types } from 'src/notifications/types-notifications/model/types-notification.default';
import { User } from 'src/users/entities/user.entity';
import { UpdateUserConfigInput } from './dto/update-user-config.input';
import { UserConfig } from './entities/user-config.entity';
import { defaultUserConfig } from './model/user-config.default';

@Injectable()
export class UserConfigService {
  constructor(
    @InjectModel(UserConfig.name)
    private readonly userConfigModel: Model<UserConfig>,
    @Inject(forwardRef(() => ConfigNotificationsService))
    private readonly configNotificationsService: ConfigNotificationsService,
  ) {}

  /**
   *create user config
   */
  async create(uid: string) {
    return this.userConfigModel.create({ uid, ...defaultUserConfig });
  }

  /**
   * find user config by uuid
   */
  async findOne(uid: string) {
    const config = await this.userConfigModel.findOne({ uid }).lean();
    if (!config) return this.create(uid);
    return {
      ...config,
      // Include additional configuration if any is added after it was created.
      notifications: {
        ...defaultUserConfig.notifications,
        ...(config?.notifications ?? {}),
      },
    };
  }

  /**
   * update user config
   */
  async update(updateUserConfigInput: UpdateUserConfigInput, user: User) {
    const currentConfig = await this.findOne(updateUserConfigInput.uid);
    const updatePromises = Object.keys(currentConfig.notifications).map(
      async (key) => {
        const newValue = updateUserConfigInput.notifications[key];
        const oldValue = currentConfig.notifications[key];
        if (oldValue == newValue) return;
        const typeId = default_notification_types
          .find((t) => t.type == key)
          ._id.toString();
        if (newValue) {
          return this.configNotificationsService.removeExcludedUserForType(
            typeId,
            user.email,
          );
        } else {
          return this.configNotificationsService.excludeUserForType(
            typeId,
            user.email,
          );
        }
      },
    );
    await Promise.all(updatePromises);
    const updatedConfig = {
      ...updateUserConfigInput,
    };
    delete updatedConfig._id;
    delete updatedConfig.uid;
    return this.userConfigModel.updateOne(
      { _id: updateUserConfigInput._id },
      { $set: { ...updatedConfig } },
    );
  }
}
