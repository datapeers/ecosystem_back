import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { LoggerModule } from 'src/logger/logger.module';
import { SendGridProvider } from './provider/sendgrid.service';
import { AWSSESProvider } from './provider/aws.service';
('./provider/aws.service');
import { EMAIL_TOKEN } from './repository/email.repository';

@Module({
  imports: [LoggerModule],
  controllers: [EmailsController],
  providers: [
    EmailsService,
    SendGridProvider,
    AWSSESProvider,
    { provide: EMAIL_TOKEN, useExisting: SendGridProvider },
  ],
  exports: [EmailsService],
})
export class EmailsModule {}
