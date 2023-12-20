import { Resolver, Mutation } from '@nestjs/graphql';
import { TypesNotificationsService } from './types-notifications.service';
import { TypesNotification } from './entities/types-notification.entity';

@Resolver(() => TypesNotification)
export class TypesNotificationsResolver {
  constructor(private readonly typesNotificationsService: TypesNotificationsService) {}

  @Mutation(() => TypesNotification)
  seedNotificationTypes() {
    return this.typesNotificationsService.seed();
  }
}
