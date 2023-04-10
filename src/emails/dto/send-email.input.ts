import { IsEmail, IsOptional, IsString } from "class-validator";

export class SendEmailInput {
  @IsString()
  @IsEmail()
  to: string;

  @IsString()
  @IsOptional()
  subject: string = "";

  @IsOptional()
  from: string;

  @IsString()
  @IsOptional()
  text: string = "";

  @IsString()
  @IsOptional()
  html: string = "";
}
