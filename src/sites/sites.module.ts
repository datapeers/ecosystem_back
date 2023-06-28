import { Module } from '@nestjs/common';
import { SitesService } from './sites.service';
import { SitesResolver } from './sites.resolver';
import { LoggerModule } from 'src/logger/logger.module';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Site, SiteSchema } from './entities/site.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Site.name, schema: SiteSchema }]),
    AuthModule,
    LoggerModule,
  ],
  providers: [SitesResolver, SitesService],
  exports: [SitesService],
})
export class SitesModule {}
