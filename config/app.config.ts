export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || AppEnvironments.Development,
  port: process.env.PORT || 3000,
});

export type AppConfiguration = ReturnType<typeof EnvConfiguration>;

export enum AppEnvironments {
  Development = "development",
  Staging = "staging",
  Production = "production",
}