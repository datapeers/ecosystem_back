import GraphQLJSON from 'graphql-type-json';
import { CreateHelpDeskInput } from './create-help-desk.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { TicketEnum } from '../enum/ticket-status.enum';
import { TicektChild } from '../entities/help-desk.entity';

@InputType()
export class UpdateHelpDeskInput extends PartialType(CreateHelpDeskInput) {
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLJSON)
  @IsOptional()
  newchild: TicektChild;

  @Field(() => String)
  @IsEnum(TicketEnum)
  @IsOptional()
  status: string;
}
