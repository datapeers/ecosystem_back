import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AppConfiguration,
  EnvConfiguration,
  AppEnvironments,
} from '../config/app.config';
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
import { ExpertModule } from './expert/expert.module';
import { ResourcesModule } from './resources/resources.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { ActivitiesConfigModule } from './activities-config/activities-config.module';
import { TypesEventsModule } from './events/types-events/types-events.module';
import { ApplicantModule } from './applicant/applicant.module';
import { TableModule } from './table/table.module';
import { BusinessModule } from './business/business.module';
import { EventsModule } from './events/events.module';
import { SitesModule } from './sites/sites.module';
import { RolModule } from './rol/rol.module';
import { DownloadsModule } from './downloads/downloads.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { ConfigEvaluationsModule } from './evaluations/config-evaluations/config-evaluations.module';
import { CalendarModule } from './calendar/calendar.module';
import GraphQLJSON from 'graphql-type-json';
import { ResourcesRepliesModule } from './resources/resources-replies/resources-replies.module';
import { UserLogModule } from './user-log/user-log.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HelpDeskModule } from './help-desk/help-desk.module';
import { ConfigurationAppModule } from './configuration-app/configuration-app.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RatingModule } from './rating/rating.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { TermsOfUseModule } from './terms-of-use/terms-of-use.module';
import { UserConfigModule } from './user-config/user-config.module';
import { TypesNotificationsModule } from './notifications/types-notifications/types-notifications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportsModule } from './reports/reports.module';

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
              path: '/subscriptions',
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
    ScheduleModule.forRoot(),
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
    ExpertModule,
    ResourcesModule,
    ResourcesRepliesModule,
    TypesEventsModule,
    AnnouncementsModule,
    ActivitiesConfigModule,
    ApplicantModule,
    TableModule,
    BusinessModule,
    EventsModule,
    SitesModule,
    RolModule,
    DownloadsModule,
    EvaluationsModule,
    ConfigEvaluationsModule,
    CalendarModule,
    UserLogModule,
    NotificationsModule,
    TypesNotificationsModule,
    HelpDeskModule,
    ConfigurationAppModule,
    EventEmitterModule.forRoot(),
    RatingModule,
    IntegrationsModule,
    TermsOfUseModule,
    UserConfigModule,
    ReportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
