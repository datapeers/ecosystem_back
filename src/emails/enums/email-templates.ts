export enum EmailTemplates {
  invitation = "invitation",
  notification = "notification",
}

export const templateNames: Record<EmailTemplates, string> = {
  [EmailTemplates.invitation]: "Invitatión",
  [EmailTemplates.notification]: "Notificatión"
}