import { Module, forwardRef } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { IntegrationsResolver } from './integrations.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'src/logger/logger.module';
import { Integration, IntegrationSchema } from './entities/integration.entity';
import { AuthModule } from 'src/auth/auth.module';
import { EmailsModule } from 'src/emails/emails.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Integration.name, schema: IntegrationSchema },
    ]),
    AuthModule,
    LoggerModule,
    forwardRef(() => EmailsModule),
  ],
  providers: [IntegrationsResolver, IntegrationsService],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
