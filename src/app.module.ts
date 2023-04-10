import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AppConfiguration,
  EnvConfiguration,
  AppEnvironments,
} from 'config/app.config';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { EmailsModule } from './emails/emails.module';
import { InvitationsModule } from './invitations/invitations.module';
import { LoggerModule } from './logger/logger.module';
import { AuthService } from './auth/auth.service';

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
          cors: true,
          debug: enableDebug,
          playground: false,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
