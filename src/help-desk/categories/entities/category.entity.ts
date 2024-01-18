import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
/**
 * category of help desk doc
 */
@Schema({ timestamps: true })
@ObjectType()
export class TicketCategory {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true, unique: true })
  name: string;

  @Field(() => String)
  @Prop({ required: true })
  color: string;

  @Field(() => Boolean)
  @Prop({ default: false })
  isDeleted: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
/**
 * @ignore
 */
export const TicketCategorySchema =
  SchemaFactory.createForClass(TicketCategory);
