export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || AppEnvironments.Development,
  port: process.env.PORT || 3000,
  mongoDb: process.env.MONGO_DB,
  sendGridKey: process.env.SEND_GRID_KEY,
  sendGridDefaultVerifiedEmail: process.env.SEND_GRID_DEFAULT_VERIFIED_EMAIL,
  sendGridInvitationTemplateId: process.env.SEND_GRID_INVITATION_TEMPLATE_ID,
  sendGridNotificationTemplateId:
    process.env.SEND_GRID_NOTIFICATION_TEMPLATE_ID,
});

export type AppConfiguration = ReturnType<typeof EnvConfiguration>;

export enum AppEnvironments {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}
