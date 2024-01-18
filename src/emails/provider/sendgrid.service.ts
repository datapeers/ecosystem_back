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
import { getIcsObjectInstance } from 'src/shared/utilities/ics';
import { Event } from 'src/events/entities/event.entity';

/**
 * send grid provider emails
 */
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

  /**
   * send one email
   */
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
      // console.log(`Email successfully dispatched to ${mail.to}`);
      return transport;
    } catch (ex) {
      console.log(ex.response.body.errors);
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
        from: this.defaultVerifiedEmail,
        templateId: templateId,
      });
      return transport;
    } catch (ex) {
      console.log(ex.response.body.errors);
      throw new InternalServerErrorException(
        'Got an unexpected exception while trying to send an email',
        ex,
      );
    }
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
    if (!this.apiKey)
      throw new MethodNotAllowedException('This service is not available');
    const toSend: SendGrid.MailDataRequired = {
      to: mail.to,
      subject: mail.subject,
      from: this.defaultVerifiedEmail,
      text: mail.text,
      html: mail.html,
    };
    const ics = getIcsObjectInstance(
      event.startAt,
      event.endAt,
      event.name,
      event.description,
      others.country ?? 'Colombia',
      others.urlRedirect,
      others.nameOrganizer,
      others.emailOrganizer,
    );

    const attachment = {
      filename: `invite${event._id}.ics`,
      name: `invite${event._id}.ics`,
      content: Buffer.from(ics.toString()).toString('base64'),
      disposition: 'attachment',
      contentId: event._id.toString(),
      type: 'text/calendar; method=REQUEST',
    };
    toSend['attachments'] = [attachment];
    try {
      const transport = await SendGrid.send(toSend);
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
