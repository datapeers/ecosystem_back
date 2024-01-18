import { CreateSiteInput } from './create-site.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';
/**
 * graphql inputs
 */
@InputType()
export class UpdateSiteInput {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => String)
  @IsOptional()
  name: string;

  @Field(() => String)
  @IsOptional()
  thumbnail: string;

  @Field(() => String)
  @IsOptional()
  description: string;

  @Field(() => String)
  @IsOptional()
  directedTo: string;

  @Field(() => String)
  @IsOptional()
  methodology: string;

  @Field(() => [String])
  @IsOptional()
  factors: string[];

  @Field(() => String)
  @IsOptional()
  results: string;

  @Field(() => [ContactServicesInput], { nullable: true })
  @IsOptional()
  contacts?: ContactServicesInput[];

  // @Field(() => GraphQLJSONObject)
  // @IsOptional()
  // coords: Record<string, any>;

  // @Field(() => [ServicesSiteInput], { nullable: true })
  // @IsOptional()
  // services?: ServicesSiteInput[];

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isDeleted?: boolean;
}
/**
 * @ignore
 */
@InputType()
export class ServicesSiteInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  contact: string;

  @Field(() => GraphQLJSONObject)
  @IsNotEmpty()
  coords: Record<string, any>;
}
/**
 * service contact person
 */
@InputType()
export class ContactServicesInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  contact: string;

  @Field(() => String)
  @IsNotEmpty()
  others: string;
}
