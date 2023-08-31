import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Mutation(() => Notification)
  createNotification(
    @Args('createNotificationInput')
    createNotificationInput: CreateNotificationInput,
  ) {
    return this.notificationsService.create(createNotificationInput);
  }

  @Query(() => [Notification], { name: 'notifications' })
  findAllByUser(@Args('userId', { type: () => ID }) userId: string) {
    return this.notificationsService.findByUser(userId);
  }

  @Query(() => Notification, { name: 'notification' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.notificationsService.findOne(id);
  }

  @Mutation(() => Notification)
  updateNotification(
    @Args('updateNotificationInput')
    updateNotificationInput: UpdateNotificationInput,
  ) {
    return this.notificationsService.update(
      updateNotificationInput._id,
      updateNotificationInput,
    );
  }

  @Mutation(() => Notification)
  removeNotification(@Args('id', { type: () => ID }) id: string) {
    return this.notificationsService.remove(id);
  }
}
