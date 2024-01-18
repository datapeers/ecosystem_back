import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { GraphQLJSONObject } from 'graphql-scalars';
/**
 * graphql args inputs
 */
@ArgsType()
export class FindUsersArgs {
  @IsOptional()
  @Field(() => String, { nullable: true })
  search?: string;

  @IsOptional()
  @Field(() => [ValidRoles], { nullable: true })
  roles?: ValidRoles[];

  @IsOptional()
  @Field(() => GraphQLJSONObject, { nullable: true })
  relationsAssign: Record<string, any>;
}
