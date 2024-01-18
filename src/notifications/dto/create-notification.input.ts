import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotificationStates } from '../enum/notification-states.enum';
import { NotificationTypes } from '../enum/notification-types.enum';
/**
 * graphql input scheme
 */
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
  target: string;

  @IsString()
  @IsNotEmpty()
  state: NotificationStates;

  @IsString()
  @IsNotEmpty()
  type: NotificationTypes;
}
