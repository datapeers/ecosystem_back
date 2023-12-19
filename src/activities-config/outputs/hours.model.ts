import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-scalars';

@ObjectType()
export class Hours {
  @Field(() => GraphQLJSONObject)
  hours: { [key: string]: any };
}
