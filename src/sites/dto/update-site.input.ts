import { CreateSiteInput } from './create-site.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';

@InputType()
export class UpdateSiteInput extends PartialType(CreateSiteInput) {
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

  @Field(() => GraphQLJSONObject)
  @IsOptional()
  coords: Record<string, any>;

  @Field(() => [ServicesSiteInput], { nullable: true })
  @IsOptional()
  services?: ServicesSiteInput[];

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isDeleted?: boolean;
}

@InputType()
export class ServicesSiteInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
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
