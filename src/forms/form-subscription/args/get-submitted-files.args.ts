import { Field, ArgsType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FormCollections } from 'src/forms/form/enums/form-collections';
/**
 * graphql args input
 */
@ArgsType()
export class GetSubmittedFilesArgs {
  @Field(() => String)
  @IsString()
  doc: string;

  @Field(() => FormCollections)
  @IsString()
  target: FormCollections;
}
