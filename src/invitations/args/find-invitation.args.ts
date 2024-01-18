import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
/**
 * graphql input args
 */
@ArgsType()
export class FindInvitationArgs {
  @IsOptional()
  @Field(() => Int, { nullable: true })
  skip: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  limit: number;
}
