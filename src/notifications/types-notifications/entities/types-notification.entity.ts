import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
/**
 * type notification class
 */
@Schema()
@ObjectType()
export class TypesNotification {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  name: string;
}
/**
 * @ignore
 */
export const TypesNotificationSchema =
  SchemaFactory.createForClass(TypesNotification);
