import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
@Schema({ timestamps: true })
@ObjectType()
export class Phase {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true })
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  thumbnail?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  landing?: string;

  @Prop({ required: true })
  @Field(() => User)
  createdBy: string;

  @Field(() => Date)
  startAt: Date;

  @Field(() => Date)
  endAt: Date;

  @Prop({ type: 'boolean', default: true })
  @Field(() => Boolean)
  isActive: boolean;

  @Prop({ type: 'boolean', default: false })
  @Field(() => Boolean)
  published: boolean;

  @Prop({ type: 'boolean', default: false })
  @Field(() => Boolean)
  deleted: boolean;

  @Prop({ type: 'boolean', default: false })
  @Field(() => Boolean)
  basePhase: boolean;

  @Field(() => String, { nullable: true })
  childrenOf: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const PhaseSchema = SchemaFactory.createForClass(Phase);
