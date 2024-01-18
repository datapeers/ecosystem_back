import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
/**
 * stages of phases
 */
@Schema({ timestamps: true })
@ObjectType()
export class Stage {
  @Field(() => ID)
  _id: string;

  @Field(() => Int)
  @Prop({ required: true })
  index: number;

  @Field(() => String)
  @Prop({ required: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Prop({ default: '' })
  description: string;

  @Field(() => String)
  @Prop({ required: true })
  label: string;

  @Field(() => String)
  @Prop({ required: true })
  color: string;

  @Field(() => String)
  @Prop({ required: true })
  icon: string;

  @Field(() => Boolean)
  @Prop({ default: false })
  isDeleted: boolean;

  @Field(() => Date, { description: 'Date of entity creation.' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date of last entity update.' })
  updatedAt: Date;
}
/**
 * @ignore
 */
export const StageSchema = SchemaFactory.createForClass(Stage);
