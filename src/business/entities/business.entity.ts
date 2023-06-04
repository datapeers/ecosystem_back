import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Business {
  @Field(() => ID)
  _id: string;

  @Field(() => GraphQLJSON, { description: "Additional dynamic entity properties." })
  @Prop({ type: Object })
  item: JSON;

  @Field(() => Date, { description: "If set, The date the entity was deleted.", nullable: true })
  @Prop()
  deletedAt: Date;

  @Field(() => User, { description: "If set, Details from user who last updated the entity.", nullable: true })
  @Prop()
  updatedBy: string;

  @Field(() => Date, { description: "Date of entity creation."})
  createdAt: Date;

  @Field(() => Date, { description: "Date of last entity update."})
  updatedAt: Date;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);