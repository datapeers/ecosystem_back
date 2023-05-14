import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';

@Schema({ timestamps: true })
@ObjectType()
export class Phase {
  @Field(() => ID)
  _id: string;

  @Field(() => String, { description: "Stage the phase belongs to." })
  @Prop({ required: true })
  stage: string;

  @Field(() => String, { description: "Phase name." })
  @Prop({ required: true })
  name: string;

  @Field(() => String, { description: "Link to a small image to be used as thumbnail.", nullable: true })
  @Prop({ default: '' })
  thumbnail: string;

  @Field(() => String, { description: "Phase description." })
  @Prop({ default: '' })
  description: string;

  @Field(() => String)
  @Prop({ default: '' })
  landing: string;

  @Field(() => User)
  @Prop({ required: true })
  createdBy: string;

  @Field(() => Date)
  @Prop({ type: Date })
  startAt: Date;

  @Field(() => Date)
  @Prop({ type: Date })
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

  @Field(() => Date, { description: "Creation date of the entity."})
  createdAt: Date;

  @Field(() => Date, { description: "Update date of the entity."})
  updatedAt: Date;
}

export const PhaseSchema = SchemaFactory.createForClass(Phase);
