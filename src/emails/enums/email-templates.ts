/**
 * posibles types of emails
 */
export enum EmailTemplates {
  invitation = 'invitation',
  notification = 'notification',
}
/**
 * name in Spanish of type invitations
 */
export const templateNames: Record<EmailTemplates, string> = {
  [EmailTemplates.invitation]: 'Invitatión',
  [EmailTemplates.notification]: 'Notificatión',
};
