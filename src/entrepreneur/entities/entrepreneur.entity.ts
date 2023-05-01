import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import GraphQLJSON from 'graphql-type-json';

@Schema({ timestamps: true })
@ObjectType()
export class Entrepreneur {
  @Field(() => ID)
  _id: string;

  @Field(() => [StartupRelationship])
  @Prop({ default: [] })
  startups: StartupRelationship[];

  @Field(() => User, { nullable: true })
  @Prop({ default: "" })
  accountId: string;

  @Field(() => GraphQLJSON)
  @Prop({ type: Object })
  item: JSON;

  @Field(() => Boolean)
  @Prop({ default: false })
  isDeleted: boolean;

  @Field(() => User, { nullable: true })
  @Prop({ default: "" })
  updatedBy: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const EntrepreneurSchema = SchemaFactory.createForClass(Entrepreneur);

@Schema()
@ObjectType()
export class StartupRelationship {
  @Field(() => String)
  @Prop()
  _id: string;
  
  @Field(() => String)
  @Prop()
  name: string;
}
