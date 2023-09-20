import { InputType, Int, Field } from '@nestjs/graphql';
import { IsObject, IsString, MinLength } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
import { TicketCategory } from '../enum/ticket-category.enum';

@InputType()
export class CreateHelpDeskInput {
  @Field(() => String)
  @IsString()
  @MinLength(2)
  title: string;

  @Field(() => GraphQLJSON)
  @IsObject()
  newChild: {
    body: string;
    attachment: string[];
  };

  @Field(() => String)
  @IsString()
  @MinLength(5)
  startupId: string;

  @Field(() => String)
  @IsString()
  @MinLength(2)
  startupName: string;

  // @Field(() => TicketCategory)
  // @IsString()
  // @MinLength(2)
  // category: TicketCategory;
}
