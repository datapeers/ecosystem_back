import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StartupService } from './startup.service';
import { StartupResolver } from './startup.resolver';
import { Startup, StartupSchema } from './entities/startup.entity';
import { AuthModule } from 'src/auth/auth.module';
import { EntrepreneurModule } from 'src/entrepreneur/entrepreneur.module';
import { ExpertModule } from 'src/expert/expert.module';
import { DownloadsModule } from 'src/downloads/downloads.module';
import { TableModule } from 'src/table/table.module';
import { EmailsModule } from 'src/emails/emails.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Startup.name, schema: StartupSchema }]),
    AuthModule,
    forwardRef(() => ExpertModule),
    forwardRef(() => EntrepreneurModule),
    DownloadsModule,
    forwardRef(() => TableModule),
    forwardRef(() => EmailsModule),
  ],
  providers: [StartupResolver, StartupService],
  exports: [StartupService],
})
export class StartupModule {}
