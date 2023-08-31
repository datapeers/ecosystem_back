import { InputType, Int, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateNotificationInput {
  @Field(() => String)
  @IsString()
  text: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  url: string;
}
