import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { FormCollections } from '../enums/form-collections';

@InputType()
export class UpdateFormInput {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

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
  @IsOptional()
  target: FormCollections;

  @Field(() => [String])
  @IsOptional()
  documents: [{}];

  @Field(() => [String])
  @IsOptional()
  keys: string[];
  
  @Field(() => String)
  @IsOptional()
  isDeleted: boolean;

  @Field(() => [String])
  @IsOptional()
  tags: string[];
}
