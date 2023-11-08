import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';
import { Body } from '@nestjs/common';
import { TicketEnum } from '../enum/ticket-status.enum';
import { TicketCategory } from '../categories/entities/category.entity';
import { Types } from 'mongoose';

@ObjectType()
export class HelpDeskTicket {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  title: string;

  @Field(() => String)
  @Prop({
    required: true,
    enum: [TicketEnum.Open, TicketEnum.InProgress, TicketEnum.Closed],
    default: 'Open',
  })
  status: string;

  @Field(() => GraphQLJSON)
  @Prop({ type: Object })
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

  @Field(() => TicketCategory)
  @Prop({ type: [{ type: Types.ObjectId, ref: 'TicketCategory' }] })
  category: TicketCategory;
}

export class TicketChild {
  body: string;
  attachment: string[];
  isResposne: boolean;
  answerBy: string;
}

export const HelpDeskTicketSchema =
  SchemaFactory.createForClass(HelpDeskTicket);
