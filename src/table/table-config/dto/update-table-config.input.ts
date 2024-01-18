import { IsNotEmpty, IsOptional } from 'class-validator';
import { InputType, Field, ID } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { TableColumn } from 'src/shared/models/table-column';
/**
 * graphql inputs
 */
@InputType()
export class UpdateTableConfigInput {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @Field(() => [GraphQLJSON], { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  columns?: TableColumn[];

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  @IsNotEmpty()
  loadEvent?: JSON;
}
