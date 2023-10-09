import { SendEmailInput } from '../dto/send-email.input';
import { Template } from '../templates/template';

export interface EmailsRepository {
  send: (mail: SendEmailInput) => Promise<any>;
  sendFromTemplate: (templateInput: Template) => Promise<any>;
}

export const EMAIL_TOKEN = 'emails-token';
