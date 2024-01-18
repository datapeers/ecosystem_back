import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsDefined,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { FormCollections } from '../enums/form-collections';
import { IFormDocument } from '../entities/form.entity';
import { Type } from 'class-transformer';
/**
 * graphql input
 */
@InputType()
export class UpdateFormInput {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  formJson?: string;

  @Field(() => FormCollections, { nullable: true })
  @IsEnum(FormCollections)
  target?: FormCollections;

  @Field(() => [InputFormDocument], { nullable: true })
  @ValidateNested({ each: true })
  @Type(() => InputFormDocument)
  documents: InputFormDocument[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  keys: string[];

  @IsEmpty()
  deletedAt?: Date;

  @IsEmpty()
  deletedBy: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  tags: string[];
}
/**
 * @ignore
 */
@InputType()
class InputFormDocument implements IFormDocument {
  @Field(() => String)
  @IsDefined()
  name: string;

  @Field(() => String)
  @IsDefined()
  observation: string;

  @Field(() => Boolean)
  @IsDefined()
  optional: boolean;

  @Field(() => String)
  @IsDefined()
  key: string;
}
