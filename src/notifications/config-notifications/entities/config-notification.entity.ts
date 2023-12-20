import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

export const ConfigNotificationSchema = SchemaFactory.createForClass(ConfigNotification);