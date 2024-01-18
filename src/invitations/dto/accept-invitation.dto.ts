import { IsString, IsNotEmpty } from 'class-validator';
/**
 * graphql input scheme
 */
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
