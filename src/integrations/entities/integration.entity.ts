import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import GraphQLJSON from 'graphql-type-json';
import { TypeIntegration } from '../enum/types.enum';
/**
 * dynamic integrations with app
 */
@Schema({ timestamps: true })
@ObjectType()
export class Integration {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true, enum: TypeIntegration })
  typeIntegration: TypeIntegration;

  @Prop({ required: true })
  @Field(() => String)
  code: string;

  @Field(() => GraphQLJSON, {
    description: 'Extra useful information',
    nullable: true,
  })
  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Field(() => Date, { description: 'Date of entity creation.' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date of last entity update.' })
  updatedAt: Date;
}
/**
 * @ignore
 */
export const IntegrationSchema = SchemaFactory.createForClass(Integration);
