import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { AppConfiguration, EnvConfiguration, AppEnvironments } from 'config/app.config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV ? `${process.cwd()}/env/${process.env.NODE_ENV}.env` : undefined,
      isGlobal: true,
      load: [ EnvConfiguration ]
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService<AppConfiguration>) => {
        const enableDebug = configService.get('environment') === AppEnvironments.Development;
        return {
          cors: true,
          debug: enableDebug,
          playground: enableDebug,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
        }
      }
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
