import * as moment from 'moment';
import { NotificationTypes } from '../enum/notification-types.enum';
import { NotificationStates } from '../enum/notification-states.enum';
/**
 * class notification global
 */
export class Notification {
  _id: string;
  text: string;
  url?: string;
  date: Date;
  target: string;
  type: NotificationTypes;
  state: NotificationStates;
  isDeleted: boolean;

  dateString: string;
  constructor(data?: Partial<Notification>) {
    const date = data ? new Date(data.date) : new Date();
    Object.assign(this, {
      ...data,
      date,
      dateString: moment(date).locale('es').format('dddd DD MMM - h:mm a'),
    });
  }
}
