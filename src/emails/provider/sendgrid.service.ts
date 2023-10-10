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
} from '@nestjs/common';
import { EmailTemplates, templateNames } from '../enums/email-templates';

export class SendGridProvider implements EmailsRepository {
  private readonly templatesId: Record<EmailTemplates, string>;
  private readonly defaultVerifiedEmail: string;
  private readonly apiKey: string;
  constructor() {
    // Set api key
    this.apiKey = process.env.SEND_GRID_KEY;
    if (this.apiKey) {
      SendGrid.setApiKey(this.apiKey);
      SendGridClient.setApiKey(this.apiKey);
    }
    // Set available templates
    this.templatesId = {
      [EmailTemplates.invitation]: process.env.SEND_GRID_INVITATION_TEMPLATE_ID,
      [EmailTemplates.notification]:
        process.env.SEND_GRID_NOTIFICATION_TEMPLATE_ID,
    };
    this.defaultVerifiedEmail = process.env.SEND_GRID_DEFAULT_VERIFIED_EMAIL;
  }

  async send(mail: SendEmailInput) {
    if (!this.apiKey)
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
      const transport = await SendGrid.send(mail);
      console.log(`Email successfully dispatched to ${mail.to}`);
      return transport;
    } catch (ex) {
      console.log(ex);
      throw new InternalServerErrorException(
        'Got an unexpected exception while trying to send an email',
        ex,
      );
    }
  }

  async sendFromTemplate(templateInput: Template) {
    const templateId = this.templatesId[templateInput.template];
    if (!templateId)
      throw new MethodNotAllowedException(
        `This template ${
          templateNames[templateInput.template]
        } is not available or configuration is missing`,
      );
    if (!this.apiKey)
      throw new MethodNotAllowedException('This service is not available');
    if (!templateInput.from) {
      if (!this.defaultVerifiedEmail) {
        throw new BadRequestException(
          'Must specify a verified email for the from field',
        );
      }
    }
    try {
      const transport = await SendGrid.send({
        ...templateInput,
        from: templateInput.from ?? this.defaultVerifiedEmail,
        templateId: templateId,
      });
      console.log(
        `Email successfully dispatched with template ${templateInput.template}`,
      );
      return transport;
    } catch (ex) {
      console.log(ex);
      throw new InternalServerErrorException(
        'Got an unexpected exception while trying to send an email',
        ex,
      );
    }
  }
}
