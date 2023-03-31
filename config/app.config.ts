export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
});

export type AppConfiguration = ReturnType<typeof EnvConfiguration>;