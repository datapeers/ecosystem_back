export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || AppEnvironments.Development,
  port: process.env.PORT || 3000,
  mongoDb: process.env.MONGO_DB,
  sendGridKey: process.env.SEND_GRID_KEY,
  sendGridDefaultVerifiedEmail: process.env.SEND_GRID_DEFAULT_VERIFIED_EMAIL,
  sendGridInvitationTemplateId: process.env.SEND_GRID_INVITATION_TEMPLATE_ID,
  sendGridNotificationTemplateId:
    process.env.SEND_GRID_NOTIFICATION_TEMPLATE_ID,
  awsS3Uri: process.env.AWS_S3_URI,
  awsS3PublicUri: process.env.AWS_S3_PUBLIC_URI,
  awsS3BucketName: process.env.AWS_S3_BUCKET_NAME ?? 'default',
  awsS3TempBucketName: process.env.AWS_S3_TEMP_BUCKET_NAME ?? 'temp',
  awsS3Region: process.env.AWS_S3_REGION ?? 'eu-west-1',
  awsS3Key: process.env.AWS_S3_KEY,
  awsS3Access: process.env.AWS_S3_ACCESS,
  appUri: process.env.APP_URI,
});

export type AppConfiguration = ReturnType<typeof EnvConfiguration>;

export enum AppEnvironments {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}
