import { Field, ArgsType } from '@nestjs/graphql';
import { IsString, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
/**
 * graphql input args
 */
@ArgsType()
export class CreateInvitationArgs {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Field(() => String)
  email: string;

  @IsEnum(ValidRoles)
  @IsNotEmpty()
  @Field(() => ValidRoles)
  rol: ValidRoles;
}
