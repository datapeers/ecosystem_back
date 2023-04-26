import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema({ timestamps: true })
@ObjectType()
export class FormTag {
  @Field(() => ID)
  _id: string;
  
  @Field(() => String)
  @Prop()
  name: string;

  @Field(() => Boolean)
  @Prop({ default: false })
  isDeleted: boolean;

  @Field( () => Date )
  createdAt: Date;

  @Field( () => Date )
  updatedAt: Date;

  @Field(() => User)
  @Prop({ default: "" })
  updatedBy: string;
}

export const FormTagSchema = SchemaFactory.createForClass(FormTag);