import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * rating of users app
 */
@Schema({ timestamps: true })
@ObjectType()
export class Rating {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  user: string;

  @Field(() => String)
  @Prop({ required: true })
  to: string;

  @Field(() => Int)
  @Prop({ required: true })
  rate: number;
}
