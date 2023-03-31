import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from 'config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV ? `${process.cwd()}/env/${process.env.NODE_ENV}.env` : undefined,
      isGlobal: true,
      load: [ EnvConfiguration ]
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
