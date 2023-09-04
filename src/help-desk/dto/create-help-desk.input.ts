import { InputType, Int, Field } from '@nestjs/graphql';
import { IsObject, IsString, MinLength } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateHelpDeskInput {
  @Field(() => String)
  @IsString()
  @MinLength(2)
  title: string;

  @Field(() => GraphQLJSON)
  @IsObject()
  newchild: {
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
}
