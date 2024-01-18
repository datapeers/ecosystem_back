import { SendEmailInput } from '../dto/send-email.input';
import { EmailsRepository } from '../repository/email.repository';
import { Template } from '../templates/template';
import * as SendGrid from '@sendgrid/mail';
import * as SendGridClient from '@sendgrid/client';
import { AppLogger } from 'src/logger/app-logger';
import {
  BadRequestException,
  InternalServerErrorException,
  MethodNotAllowedException,
  Logger,
} from '@nestjs/common';
import { EmailTemplates, templateNames } from '../enums/email-templates';
import {
  SESClient,
  SendEmailCommand,
  SendBulkTemplatedEmailCommand,
} from '@aws-sdk/client-ses';
import { TemplateData } from '../templates/data';
import { Event } from 'src/events/entities/event.entity';

/**
 * aws provider for emails
 */
export class AWSSESProvider implements EmailsRepository {
  private readonly templatesId: Record<EmailTemplates, string>;
  private readonly defaultVerifiedEmail: string;
  private readonly apiKey: string;

  private client: SESClient;
  private logger = new Logger(AWSSESProvider.name);
  constructor() {
    // Set api key
    // console.log(process.env.AWS_SES_REGION);
    this.client = new SESClient({
      apiVersion: '2010-12-01',
      region: process.env.AWS_SES_REGION,
      credentials: {
        accessKeyId: process.env.AWS_SES_KEY,
        secretAccessKey: process.env.AWS_SES_ACCESS,
      },
    });
    // Set available templates
    // this.templatesId = {
    //   [EmailTemplates.invitation]: process.env.SEND_GRID_INVITATION_TEMPLATE_ID,
    //   [EmailTemplates.notification]:
    //     process.env.SEND_GRID_NOTIFICATION_TEMPLATE_ID,
    // };
  }

  /**
   * send one email
   */
  async send(mail: SendEmailInput) {
    if (!this.client)
      throw new MethodNotAllowedException('This service is not available');

    if (!mail.from) {
      if (!this.defaultVerifiedEmail) {
        throw new BadRequestException(
          'Must specify a verified email for the from field',
        );
      }
      mail.from = this.defaultVerifiedEmail;
    }
    try {
      const sendEmailCommand = new SendEmailCommand({
        Destination: {
          ToAddresses: [mail.to],
        },
        Message: {
          Body: {
            Html: { Data: mail.html },
          },
          Subject: {
            Data: mail.subject,
          },
        },
        Source: mail.from,
      });
      const resp = await this.client.send(sendEmailCommand);
      this.logger.log(`Email successfully dispatched to ${mail.to}`);
      return [resp, { state: 'successful' }];
    } catch (ex) {
      this.logger.error(ex);
      throw new InternalServerErrorException(
        'Got an unexpected exception while trying to send an email',
        ex,
      );
    }
  }

  /**
   * send one email by template
   */
  async sendFromTemplate(templateInput: Template) {
    //console.log(templateInput);
    const emailTemplate = new SendBulkTemplatedEmailCommand({
      Source: templateInput.from,
      Template: templateInput.template,
      Destinations: templateInput.personalizations.map((i) => ({
        Destination: {
          ToAddresses: i.to.map((o) => o.email),
        },
        ReplacementTemplateData: JSON.stringify(i),
      })),
    });
    try {
      const resp = await this.client.send(emailTemplate);
      this.logger.log(`Email successfully dispatched`);
      return [resp, { state: 'successful' }];
    } catch (ex) {
      this.logger.error(ex);
      throw new InternalServerErrorException(
        'Got an unexpected exception while trying to send an email',
        ex,
      );
    }
  }
  // const templateId = this.templatesId[templateInput.template];
  // if (!templateId)
  //   throw new MethodNotAllowedException(
  //     `This template ${
  //       templateNames[templateInput.template]
  //     } is not available or configuration is missing`,
  //   );
  // if (!this.apiKey)
  //   throw new MethodNotAllowedException('This service is not available');
  // if (!templateInput.from) {
  //   if (!this.defaultVerifiedEmail) {
  //     throw new BadRequestException(
  //       'Must specify a verified email for the from field',
  //     );
  //   }
  // }
  // try {
  //   const transport = await SendGrid.send({
  //     ...templateInput,
  //     from: templateInput.from ?? this.defaultVerifiedEmail,
  //     templateId: templateId,
  //   });
  //   this.logger.log(
  //     `Email successfully dispatched with template ${templateInput.template}`,
  //   );
  //   return transport;
  // } catch (ex) {

  // }
  /**
   * send one email with ics
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
    return null;
  }
}
