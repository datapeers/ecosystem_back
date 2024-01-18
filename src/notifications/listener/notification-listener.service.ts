import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../notifications.service';

/**
 * @ignore
 */
@Injectable()
export class NotificationListenerService {
  constructor(private readonly notificationService: NotificationsService) {}
  @OnEvent('set.notification')
  async setNotification(payload: Record<any, any>) {
    if (!payload.userId) return;
    // await this.notificationService.create({
    //   text: payload.text ?? '',
    //   url: payload.url ?? '',
    //   userId: payload.userId,
    // });
  }
}
