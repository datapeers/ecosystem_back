import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';
import { ContactServicesInput } from './update-site.input';
/**
 * graphql inputs
 */
@InputType()
export class CreateSiteInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String, { nullable: true })
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
  contacts: ContactServicesInput[];

  // @Field(() => GraphQLJSONObject)
  // @IsOptional()
  // coords: Record<string, any>;
}
