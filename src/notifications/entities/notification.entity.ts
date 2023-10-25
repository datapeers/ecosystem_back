import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NotificationTypes } from '../enum/notification-types.enum';
import { NotificationStates } from '../enum/notification-states.enum';

@Schema({ timestamps: true })
@ObjectType()
export class Notification {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  text: string;

  @Field(() => Date)
  @Prop({ required: true })
  date: Date;

  @Field(() => String, { nullable: true })
  @Prop({})
  url: string;

  @Field(() => String)
  @Prop({ required: true })
  target: string;

  @Field(() => String)
  @Prop({ required: true })
  state: NotificationStates;

  @Field(() => String)
  @Prop({ required: true })
  type: NotificationTypes;

  @Field(() => Boolean)
  @Prop({ default: false })
  isDeleted: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
