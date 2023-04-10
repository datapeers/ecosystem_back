import { IsString, IsNotEmpty } from 'class-validator';

export class AcceptInvitationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsString()
  @IsNotEmpty()
  code: string;
  
  @IsString()
  @IsNotEmpty()
  password: string;
}
