import { InputType, Int, Field } from '@nestjs/graphql';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
import { TicketEnum } from '../enum/ticket-status.enum';
/**
 * graphql input scheme
 */
@InputType()
export class HelpDeskFilterInput {
  @Field(() => String)
  @IsEnum(TicketEnum)
  @IsOptional()
  status: string;

  @Field(() => String)
  @IsString()
  @MinLength(2)
  @IsOptional()
  startupId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  perPage: number;
}
