import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ID,
  Subscription,
} from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';
import { AuthUser } from '../auth/types/auth-user';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { OthersInput } from './dto/others.inpt';
/**
 * @ignore
 */
@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  // @Subscription(() => Notification, {
  //   filter(payload, variables) {
  //     const notificationTargets = variables.target.split(';');
  //     let notificationAccepted = false;
  //     for (const iterator of notificationTargets) {
  //       if (payload.notificationTarget.includes(iterator)) {
  //         notificationAccepted = true;
  //         break;
  //       }
  //     }
  //     return notificationAccepted;
  //   },
  // })
  // listenFormSubscription(
  //   @Args('OthersInput') OthersInput: OthersInput,
  //   @CurrentUser() user: AuthUser,
  // ) {
  //   return this.notificationsService.subscribe(user, OthersInput.others);
  // }

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

  @Query(() => [Notification], { name: 'notificationsTargets' })
  findNotificationsByTargets(
    @Args('targets', { type: () => [String] }) targets: string[],
  ) {
    return this.notificationsService.findNotificationsByTargets(targets);
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

  @Mutation(() => Notification, { nullable: true })
  removeNotification(@Args('id', { type: () => ID }) id: string) {
    return this.notificationsService.remove(id);
  }
}
