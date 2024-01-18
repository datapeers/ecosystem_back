import { IsBoolean, IsString } from 'class-validator';
import { CreateNotificationInput } from './create-notification.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { NotificationStates } from '../enum/notification-states.enum';
import { IsNotEmpty, IsOptional } from 'class-validator';
/**
 * graphql input scheme
 */
@InputType()
export class UpdateNotificationInput extends PartialType(
  CreateNotificationInput,
) {
  @Field(() => ID)
  @IsNotEmpty()
  _id: string;

  @Field(() => String)
  @IsOptional()
  state?: NotificationStates;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isDeleted?: boolean;
}
