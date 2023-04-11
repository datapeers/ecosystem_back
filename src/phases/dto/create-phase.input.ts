import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePhaseInput {
  @Field(() => String, { nullable: true })
  childrenOf?: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  thumbnail?: string;

  @Field(() => Date)
  startAt: Date;

  @Field(() => Date)
  endAt: Date;
}
