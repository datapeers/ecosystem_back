import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: { createdAt: true } })
@ObjectType()
export class AuthCode {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  token: string;

  @Field(() => Date, { nullable: true })
  @Prop({ expires: 60 })
  createdAt: Date;
}

export const AuthCodeSchema = SchemaFactory.createForClass(AuthCode);