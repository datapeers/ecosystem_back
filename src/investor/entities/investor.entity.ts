import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
import GraphQLJSON from 'graphql-type-json';
/**
 * @ignore
 */
@Schema({ timestamps: true })
@ObjectType()
export class Investor {
  @Field(() => ID)
  _id: string;

  @Field(() => User, { nullable: true })
  @Prop({ default: '' })
  accountId: string;

  @Field(() => GraphQLJSON)
  @Prop({ type: Object })
  item: JSON;

  @Field(() => Date, {
    description: 'If set, The date the entity was deleted.',
    nullable: true,
  })
  @Prop()
  deletedAt: Date;

  @Field(() => User, {
    description: 'If set, Details from user who last updated the entity.',
    nullable: true,
  })
  @Prop()
  updatedBy: string;

  @Field(() => Date, { description: 'Date of entity creation.' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date of last entity update.' })
  updatedAt: Date;
}
/**
 * @ignore
 */
export const InvestorSchema = SchemaFactory.createForClass(Investor);
