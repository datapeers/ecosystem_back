import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { FormCollections } from '../enums/form-collections';

@InputType()
export class CreateFormInput {
  @Field(() => String)
  @IsOptional()
  name: string;

  @Field(() => String)
  @IsOptional()
  description: string;

  @Field(() => String)
  @IsOptional()
  formJson: string;

  @Field(() => String)
  @IsNotEmpty()
  target: FormCollections;

  @Field(() => [String])
  @IsOptional()
  documents: string[];

  @Field(() => [String])
  @IsOptional()
  keys: string[];

  @Field(() => [String])
  @IsOptional()
  tags: string[];
}
