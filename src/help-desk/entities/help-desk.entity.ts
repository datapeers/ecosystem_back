import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TicketEnum } from '../enum/ticket-status.enum';
import { TicketCategory } from '../enum/ticket-category.enum';
import { GraphQLJSONObject } from 'graphql-scalars';
import { SchemaTypes } from 'mongoose';
import { IFileUpload } from 'src/shared/models/file';
/**
 * help desk docs
 */
@Schema({ timestamps: true })
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
/**
 * answer to post
 */
export class TicketChild {
  body: string;
  attachment: IFileUpload[];
  isResponse: boolean;
  answerBy: string;
  answerById: string;
}
/**
 * @ignore
 */
export const HelpDeskTicketSchema =
  SchemaFactory.createForClass(HelpDeskTicket);
