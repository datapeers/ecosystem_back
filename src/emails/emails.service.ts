import { BadRequestException, Injectable, InternalServerErrorException, MethodNotAllowedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfiguration } from 'config/app.config';
import * as SendGrid from '@sendgrid/mail';
import { SendEmailInput } from './dto/send-email.input';

@Injectable()
export class EmailsService {
  private readonly defaultVerifiedEmail: string;
  private readonly apiKey: string;
  constructor(private readonly configService: ConfigService<AppConfiguration>) {
    this.apiKey = this.configService.get<string>('sendGridKey');
    if(this.apiKey) {
      SendGrid.setApiKey(this.apiKey);
    }
    this.defaultVerifiedEmail = this.configService.get<string>('sendGridDefaultVerifiedEmail');
  }

  async send(mail: SendEmailInput) {
    if(!this.apiKey) throw new MethodNotAllowedException();

    if(!mail.from) {
      if(!this.defaultVerifiedEmail) {
        throw new BadRequestException("Must specify a verified email for the from field");
      }
      mail.from = this.defaultVerifiedEmail;
    }
    try {
      const transport = await SendGrid.send(mail);
      console.log(`Email successfully dispatched to ${mail.to}`);
      return transport;
    } catch(ex) {
      console.error(ex);
      throw new InternalServerErrorException("Got an unexpected exception while trying to send an email");
    }
  }
}
