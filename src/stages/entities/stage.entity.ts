import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
@ObjectType()
export class Stage {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  name: string;

  @Field(() => String)
  @Prop({ required: true })
  label: string;

  @Field(() => String)
  @Prop({ required: true })
  color: string;

  @Field(() => Boolean)
  @Prop({ default: false })
  isDeleted: boolean;

  @Field(() => Date, { description: 'Date of entity creation.' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date of last entity update.' })
  updatedAt: Date;
}

export const StageSchema = SchemaFactory.createForClass(Stage);
