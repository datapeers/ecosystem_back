import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EmailTemplates } from '../enums/email-templates';
import { Template } from '../templates/template';
import { NotificationTemplate } from '../templates/notification';
import { InvitationTemplate } from '../templates/invitation';

/**
 * graphql input scheme
 */
export class TemplateInput {
  @IsNotEmpty()
  @IsEnum(EmailTemplates)
  template: EmailTemplates;

  @ValidateNested()
  @IsNotEmpty()
  @Type(
    ({ object }) => {
      switch (object.template) {
        case EmailTemplates.invitation:
          return InvitationTemplate;
        case EmailTemplates.notification:
          return NotificationTemplate;
        default:
        // Manage edge cases
      }
    },
    { keepDiscriminatorProperty: false },
  )
  data: Template;
}
