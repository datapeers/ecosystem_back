import { IsNotEmpty, IsOptional } from 'class-validator';

import { GraphQLJSONObject } from 'graphql-scalars';
import { Content } from '../entities/content.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LastContentOutput {
  @Field()
  lastContent: Content;
  @Field()
  contentCompleted: number;
  @Field()
  numberOfContent: number;
}
