import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Body } from '@nestjs/common';
import { TicketEnum } from '../enum/ticket-status.enum';
import { TicketCategory } from '../enum/ticket-category.enum';
import { GraphQLJSONObject } from 'graphql-scalars';
import { SchemaTypes } from 'mongoose';
@ObjectType()
export class HelpDeskTicket {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  title: string;

  @Prop({
    type: String,
    enum: TicketCategory,
    default: TicketCategory.support,
  })
  @Field(() => String)
  category: TicketCategory;

  @Prop({
    type: String,
    enum: TicketEnum,
    default: TicketEnum.Open,
  })
  @Field(() => String)
  status: TicketEnum;

  @Field(() => [GraphQLJSONObject])
  @Prop({ type: [{ type: SchemaTypes.Mixed }] })
  childs: TicketChild[];

  @Field(() => String)
  @Prop({ required: true })
  startupId: string;

  @Field(() => String)
  @Prop({ required: true })
  startupName: string;

  @Field(() => Boolean)
  @Prop({ default: false })
  isDeleted: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export class TicketChild {
  body: string;
  attachment: string[];
  isResponse: boolean;
  answerBy: string;
}

export const HelpDeskTicketSchema =
  SchemaFactory.createForClass(HelpDeskTicket);
