import { IsBoolean, IsString } from 'class-validator';
import { CreateNotificationInput } from './create-notification.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateNotificationInput extends PartialType(
  CreateNotificationInput,
) {
  @Field(() => ID)
  @IsString()
  _id: string;

  @Field(() => Boolean)
  @IsBoolean()
  readed: string;
}
