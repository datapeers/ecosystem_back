import { Types } from 'mongoose';
import { EmailNotificationTypes } from './email-notification-types.enum';
/**
 * default types of notifications
 */
export const default_notification_types = [
  {
    _id: new Types.ObjectId('646f943cc2305c411d73f6d2'),
    name: 'Invitación a evento',
    type: EmailNotificationTypes.invitationToEvent,
  },
  {
    _id: new Types.ObjectId('646f9538c2305c411d73f6f2'),
    name: 'Actualización Evento',
    type: EmailNotificationTypes.eventUpdate,
  },
  {
    _id: new Types.ObjectId('646f953cc2305c411d73f702'),
    name: 'Recurso calificado',
    type: EmailNotificationTypes.qualifiedResource,
  },
  {
    _id: new Types.ObjectId('646f941ac2305c411d73f6c2'),
    name: 'Recurso próximo a vencer',
    type: EmailNotificationTypes.resourceExpiringSoon,
  },
  {
    _id: new Types.ObjectId('646f953dc2305c411d73f702'),
    name: 'Culminación de fase',
    type: EmailNotificationTypes.phaseCompletion,
  },
  {
    _id: new Types.ObjectId('646f958cc2305c411d73f712'),
    name: 'Evaluación disponible',
    type: EmailNotificationTypes.assessmentAvailable,
  },
  {
    _id: new Types.ObjectId('646f9598c2305c411d73f712'),
    name: 'Actualización ticket mesa de ayuda',
    type: EmailNotificationTypes.helpdeskTicketUpdate,
  },
];
