import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
@ObjectType()
export class Notification {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  text: string;

  @Field(() => String)
  @Prop({})
  url: string;

  @Field(() => String)
  @Prop({})
  userId: string;

  @Field(() => Boolean)
  @Prop({ type: Boolean, default: false })
  readed: boolean;

  @Field(() => Boolean)
  @Prop({ default: false })
  isDeleted: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
