import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
/**
 * roles in app
 */
@Schema({ timestamps: true })
@ObjectType()
export class Rol {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  type: string;

  @Field(() => String)
  @Prop({ required: true })
  name: string;

  @Field(() => [String])
  @Prop({ default: [] })
  permissions: string[];

  @Field(() => Date, { description: 'Date of entity creation.' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date of last entity update.' })
  updatedAt: Date;
}
/**
 * @ignore
 */
export const RolSchema = SchemaFactory.createForClass(Rol);
