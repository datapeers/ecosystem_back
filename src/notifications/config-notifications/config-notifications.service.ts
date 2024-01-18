import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateConfigNotificationInput } from './dto/create-config-notification.input';
import { ConfigNotification } from './entities/config-notification.entity';

@Injectable()
export class ConfigNotificationsService {
  constructor(
    @InjectModel(ConfigNotification.name)
    private readonly configNotificationModel: Model<ConfigNotification>,
  ) {}

  /**
   * create an config notification for user
   */
  async create(createConfigNotificationInput: CreateConfigNotificationInput) {
    const config = new ConfigNotification();
    config.type = createConfigNotificationInput.type;
    config.excluded = createConfigNotificationInput.excluded;
    return this.configNotificationModel.create(config);
  }

  /**
   * find config notification by type
   */
  async findByType(type: string): Promise<ConfigNotification> {
    const configByType: ConfigNotification = await this.configNotificationModel
      .findOne({ type: type })
      .lean();
    if (!configByType) {
      const created = await this.create({ type, excluded: [] });
      if (!created)
        throw new InternalServerErrorException(
          `Failed to create notification config for type ${type}`,
        );
      return created;
    }
    return configByType;
  }

  /**
   * exclude a user for a specific type of notification
   */
  async excludeUserForType(type: string, userEmail: string) {
    const updateResult = await this.configNotificationModel.updateOne(
      { type },
      { $addToSet: { excluded: userEmail } },
    );
    if (updateResult.matchedCount == 0)
      await this.create({ type, excluded: [userEmail] });
  }

  /**
   * remove exclude a user for a specific type of notification
   */
  async removeExcludedUserForType(type: string, userEmail: string) {
    const updateResult = await this.configNotificationModel.updateOne(
      { type },
      { $pull: { excluded: userEmail } },
    );
    if (updateResult.matchedCount == 0)
      await this.create({ type, excluded: [] });
  }
}
