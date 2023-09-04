import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateNotificationInput {
  @Field(() => String)
  @IsString()
  text: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  url: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  userId: string;
}
