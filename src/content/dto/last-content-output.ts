import { IsNotEmpty, IsOptional } from 'class-validator';

import { GraphQLJSONObject } from 'graphql-scalars';
import { Content } from '../entities/content.entity';
import { Field, ObjectType } from '@nestjs/graphql';
/**
 * graphql input scheme
 */
@ObjectType()
export class LastContentOutput {
  @Field({ nullable: true })
  lastContent: Content;
  @Field()
  contentCompleted: number;
  @Field()
  numberOfContent: number;
  @Field()
  numberOfResourcesPending: number;
}
