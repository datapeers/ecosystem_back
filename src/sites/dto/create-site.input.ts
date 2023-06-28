import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';

@InputType()
export class CreateSiteInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  thumbnail: string;

  @Field(() => String)
  @IsNotEmpty()
  description: string;

  @Field(() => GraphQLJSONObject)
  @IsOptional()
  coords: Record<string, any>;
}
