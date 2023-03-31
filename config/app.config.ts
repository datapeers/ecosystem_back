export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || AppEnvironments.Development,
  port: process.env.PORT || 3000,
  mongoDb: process.env.MONGO_DB,
});

export type AppConfiguration = ReturnType<typeof EnvConfiguration>;

export enum AppEnvironments {
  Development = "development",
  Staging = "staging",
  Production = "production",
}