import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
/**
 * @ignore
 */
@Schema()
@ObjectType()
export class ConfigNotification {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  type: string;

  @Field(() => [String])
  @Prop({ required: true })
  excluded: string[];
}
/**
 * @ignore
 */
export const ConfigNotificationSchema =
  SchemaFactory.createForClass(ConfigNotification);
