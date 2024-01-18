import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
/**
 * Authorization code management for users
 */
@Schema({ timestamps: { createdAt: true } })
@ObjectType()
export class AuthCode {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  token: string;

  @Field(() => [String])
  @Prop({ required: true })
  permissions: string[];

  @Field(() => Date, { nullable: true })
  @Prop({ expires: 60 })
  createdAt: Date;
}
/**
 * @ignore
 */
export const AuthCodeSchema = SchemaFactory.createForClass(AuthCode);
