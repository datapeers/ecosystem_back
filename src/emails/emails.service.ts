import { SendEmailInput } from './dto/send-email.input';
import { AppLogger } from 'src/logger/app-logger';
import { Template } from './templates/template';
import { EMAIL_TOKEN, EmailsRepository } from './repository/email.repository';
import { EmailTemplates, templateNames } from './enums/email-templates';
import {
  Inject,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfiguration } from 'config/app.config';
import * as SendGrid from '@sendgrid/mail';
import * as SendGridClient from '@sendgrid/client';
import { Event } from 'src/events/entities/event.entity';
@Injectable()
export class EmailsService {
  constructor(
    @Inject(EMAIL_TOKEN) private readonly emailService: EmailsRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(EmailsService.name);
  }

  /**
   * send one email
   */
  async send(mail: SendEmailInput) {
    return this.emailService.send(mail);
  }

  /**
   * send one email by template
   */
  async sendFromTemplate(templateInput: Template) {
    return this.emailService.sendFromTemplate(templateInput);
  }

  /**
   * send one email with ics file
   */
  async sendIcs(
    mail: {
      to: string | string[];
      subject: string;
      text: string;
      html: string;
    },
    event: Event,
    others: {
      nameOrganizer: string;
      emailOrganizer: string;
      urlRedirect: string;
      country?: string;
    },
  ) {
    return this.emailService.sendIcs(mail, event, others);
  }
  // private readonly templatesId: Record<EmailTemplates, string>;
  // private readonly defaultVerifiedEmail: string;
  // private readonly apiKey: string;
  // constructor(
  //   private readonly configService: ConfigService<AppConfiguration>,
  //   private readonly logger: AppLogger,
  // ) {
  //   this.logger.setContext(EmailsService.name);
  //   // Set api key
  //   this.apiKey = this.configService.get<string>('sendGridKey');
  //   if (this.apiKey) {
  //     SendGrid.setApiKey(this.apiKey);
  //     SendGridClient.setApiKey(this.apiKey);
  //   }
  //   // Set available templates
  //   this.templatesId = {
  //     [EmailTemplates.invitation]: configService.get(
  //       'sendGridInvitationTemplateId',
  //     ),
  //     [EmailTemplates.notification]: configService.get(
  //       'sendGridNotificationTemplateId',
  //     ),
  //   };
  //   this.defaultVerifiedEmail = this.configService.get<string>(
  //     'sendGridDefaultVerifiedEmail',
  //   );
  // }

  // async send(mail: SendEmailInput) {
  //   if (!this.apiKey)
  //     throw new MethodNotAllowedException('This service is not available');

  //   if (!mail.from) {
  //     if (!this.defaultVerifiedEmail) {
  //       throw new BadRequestException(
  //         'Must specify a verified email for the from field',
  //       );
  //     }
  //     mail.from = this.defaultVerifiedEmail;
  //   }
  //   try {
  //     const transport = await SendGrid.send(mail);
  //     this.logger.log(`Email successfully dispatched to ${mail.to}`);
  //     return transport;
  //   } catch (ex) {
  //     this.logger.error(ex);
  //     throw new InternalServerErrorException(
  //       'Got an unexpected exception while trying to send an email',
  //       ex,
  //     );
  //   }
  // }

  // async sendFromTemplate(templateInput: Template) {
  //   const templateId = this.templatesId[templateInput.template];
  //   if (!templateId)
  //     throw new MethodNotAllowedException(
  //       `This template ${
  //         templateNames[templateInput.template]
  //       } is not available or configuration is missing`,
  //     );
  //   if (!this.apiKey)
  //     throw new MethodNotAllowedException('This service is not available');
  //   if (!templateInput.from) {
  //     if (!this.defaultVerifiedEmail) {
  //       throw new BadRequestException(
  //         'Must specify a verified email for the from field',
  //       );
  //     }
  //   }
  //   try {
  //     const transport = await SendGrid.send({
  //       ...templateInput,
  //       from: templateInput.from ?? this.defaultVerifiedEmail,
  //       templateId: templateId,
  //     });
  //     this.logger.log(
  //       `Email successfully dispatched with template ${templateInput.template}`,
  //     );
  //     return transport;
  //   } catch (ex) {
  //     this.logger.error(ex);
  //     throw new InternalServerErrorException(
  //       'Got an unexpected exception while trying to send an email',
  //       ex,
  //     );
  //   }
  // }
}
