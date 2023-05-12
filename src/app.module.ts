import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfiguration, EnvConfiguration, AppEnvironments, } from 'config/app.config';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { EmailsModule } from './emails/emails.module';
import { InvitationsModule } from './invitations/invitations.module';
import { LoggerModule } from './logger/logger.module';
import { AuthService } from './auth/auth.service';
import { PhasesModule } from './phases/phases.module';
import { StagesModule } from './stages/stages.module';
import { StorageModule } from './storage/storage.module';
import { ContentModule } from './content/content.module';
import { FormsModule } from './forms/forms.module';
import { AuthCodeModule } from './auth-code/auth-code.module';
import { EntrepreneurModule } from './entrepreneur/entrepreneur.module';
import { StartupModule } from './startup/startup.module';
import { InvestorModule } from './investor/investor.module';
import { ResponsibleModule } from './responsible/responsible.module';
import { ResourcesModule } from './resources/resources.module';
import { ActivitiesConfigModule } from './activities-config/activities-config.module';
import GraphQLJSON from 'graphql-type-json';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV
        ? `${process.cwd()}/env/${process.env.NODE_ENV}.env`
        : undefined,
      isGlobal: true,
      load: [EnvConfiguration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<AppConfiguration>) => {
        return {
          uri: configService.get('mongoDb'),
        };
      },
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule, AuthModule],
      inject: [ConfigService, AuthService],
      driver: ApolloDriver,
      useFactory: async (
        configService: ConfigService<AppConfiguration>,
        authService: AuthService,
      ) => {
        const enableDebug =
          configService.get('environment') === AppEnvironments.Development;
        const plugins = [];
        if (enableDebug) {
          plugins.push(ApolloServerPluginLandingPageLocalDefault());
        }
        return {
          resolvers: { JSON: GraphQLJSON },
          cors: {
            credentials: true,
            origin: '*',
          },
          debug: enableDebug,
          playground: false,
          subscriptions: {
            'graphql-ws': {
              path: '/subscriptions'
            },
          },
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          plugins,
          // context: async ({ req }) => {
          //   const token = req.headers.authorization.replace('Bearer ', '');
          //   await authService.validateToken(token);
          // },
        };
      },
    }),
    UsersModule,
    AuthModule,
    EmailsModule,
    InvitationsModule,
    LoggerModule,
    PhasesModule,
    StagesModule,
    StorageModule,
    ContentModule,
    FormsModule,
    AuthCodeModule,
    EntrepreneurModule,
    StartupModule,
    InvestorModule,
    ResponsibleModule,
    ResourcesModule,
    ActivitiesConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
