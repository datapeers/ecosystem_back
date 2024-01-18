import { Controller, Post, Body } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { SendEmailInput } from './dto/send-email.input';
import { TemplateInput } from './dto/template.input';
@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}
  /**
   * send email http endpoint
   */
  @Post()
  sendEmail(@Body() createEmailDto: SendEmailInput) {
    return this.emailsService.send(createEmailDto);
  }

  /**
   * send email template http endpoint
   */
  @Post('/template')
  sendEmailTemplate(@Body() createEmailDto: TemplateInput) {
    return this.emailsService.sendFromTemplate(createEmailDto.data);
  }
}
