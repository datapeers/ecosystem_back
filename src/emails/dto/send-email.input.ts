import { IsEmail, IsOptional, IsString } from 'class-validator';

/**
 * graphql input scheme
 */
export class SendEmailInput {
  @IsString()
  @IsEmail()
  to: string;

  @IsString()
  @IsOptional()
  subject: string = '';

  @IsOptional()
  from: string;

  @IsString()
  @IsOptional()
  text: string = '';

  @IsString()
  @IsOptional()
  html: string = '';
}
