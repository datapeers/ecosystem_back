import { Injectable } from '@nestjs/common';
import { pubSubInstance } from 'src/shared/sockets/socket-instance';
import { Resolver, Subscription, Args } from '@nestjs/graphql';
import { Notification } from './entities/notification.entity';

const pubSub = pubSubInstance;

@Resolver('Notifications')
export class NotificationSubscritpionResolver {
  @Subscription(() => Notification, {
    name: 'notificationSubscription',
    nullable: true,
    filter: (payload, variables) =>
      payload.notificationSubscription.userId == variables.userId,
  })
  notificationTriggered(@Args('userId') userId: string) {
    return pubSub.asyncIterator(`notification-${userId}`);
  }
}
