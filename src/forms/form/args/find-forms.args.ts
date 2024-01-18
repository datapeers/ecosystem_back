import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { FormCollections } from '../enums/form-collections';
/**
 * graphql args input
 */
@ArgsType()
export class FindFormsArgs {
  @IsOptional()
  @Field(() => FormCollections, { nullable: true })
  target?: FormCollections;
}
