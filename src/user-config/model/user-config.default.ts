import { EmailNotificationTypes } from 'src/notifications/types-notifications/model/email-notification-types.enum';
/**
 * @ignore
 */
const defaultNotificationsConfig: Record<EmailNotificationTypes, boolean> = {
  [EmailNotificationTypes.invitationToEvent]: true,
  [EmailNotificationTypes.eventUpdate]: true,
  [EmailNotificationTypes.qualifiedResource]: true,
  [EmailNotificationTypes.resourceExpiringSoon]: true,
  [EmailNotificationTypes.phaseCompletion]: true,
  [EmailNotificationTypes.assessmentAvailable]: true,
  [EmailNotificationTypes.helpdeskTicketUpdate]: true,
};
/**
 * @ignore
 */
export const defaultUserConfig = {
  notifications: defaultNotificationsConfig,
};
