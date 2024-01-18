import GraphQLJSON from 'graphql-type-json';
import { CreateHelpDeskInput } from './create-help-desk.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { TicketEnum } from '../enum/ticket-status.enum';
import { TicketChild } from '../entities/help-desk.entity';
/**
 * graphql input scheme
 */
@InputType()
export class UpdateHelpDeskInput extends PartialType(CreateHelpDeskInput) {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => [GraphQLJSON], { nullable: true })
  @IsOptional()
  childs?: TicketChild[];

  @Field(() => String, { nullable: true })
  @IsEnum(TicketEnum)
  @IsOptional()
  status?: string;
}
