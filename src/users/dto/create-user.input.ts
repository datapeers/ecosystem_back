import { InputType, Field } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
/**
 * graphql inputs
 */
@InputType()
export class CreateUserInput {
  @Field(() => String, { nullable: true })
  uid: string;

  @Field(() => String, { nullable: true })
  fullName: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  profileImageUrl?: string;

  @Field(() => [ValidRoles], { nullable: true })
  @IsEnum(ValidRoles, { each: true })
  roles: ValidRoles[];
}
