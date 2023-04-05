import { Controller, Post, Body } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { SendEmailInput } from './dto/send-email.input';
@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post()
  create(@Body() createEmailDto: SendEmailInput) {
    return this.emailsService.send(createEmailDto);
  }
}
