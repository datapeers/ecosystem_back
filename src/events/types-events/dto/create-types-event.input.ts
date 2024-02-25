import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';
/**
 * graphql input scheme
 */
@InputType()
export class CreateTypesEventInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => GraphQLJSONObject)
  @IsOptional()
  extra_options: Record<string, any>;

  @Field(() => Boolean, { nullable: false })
  @IsOptional()
  expertFocus?: boolean;

  @Field(() => Boolean, { nullable: false })
  @IsOptional()
  isSchedulable?: boolean;

  @Field(() => String, { nullable: false })
  @IsOptional()
  scheduleUrl?: string;

  @Field(() => String, { nullable: false })
  @IsOptional()
  description?: string;
}
