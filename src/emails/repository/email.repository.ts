import { Event } from 'src/events/entities/event.entity';
import { SendEmailInput } from '../dto/send-email.input';
import { Template } from '../templates/template';

/**
 * email repository
 */
export interface EmailsRepository {
  send: (mail: SendEmailInput) => Promise<any>;
  sendFromTemplate: (templateInput: Template) => Promise<any>;
  sendIcs: (
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
  ) => Promise<any>;
}
/**
 * @ignore
 */
export const EMAIL_TOKEN = 'emails-token';
