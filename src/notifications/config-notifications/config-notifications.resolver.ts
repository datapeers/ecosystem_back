import { Resolver } from '@nestjs/graphql';
import { ConfigNotificationsService } from './config-notifications.service';
import { ConfigNotification } from './entities/config-notification.entity';
/**
 * @ignore
 */
@Resolver(() => ConfigNotification)
export class ConfigNotificationsResolver {
  constructor(
    private readonly configNotificationsService: ConfigNotificationsService,
  ) {}
}
