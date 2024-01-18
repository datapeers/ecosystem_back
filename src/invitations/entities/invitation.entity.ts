import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { InvitationStates } from '../enums/invitation-states.enum';
import { User } from 'src/users/entities/user.entity';
import GraphQLJSON from 'graphql-type-json';
/**
 * invitations to use app
 */
@ObjectType()
@Schema({ timestamps: true })
export class Invitation {
  @Field(() => ID)
  _id: string;

  @Prop()
  code: string;

  @Prop({ index: true })
  @Field(() => String)
  email: string;

  @Prop()
  @Field(() => ValidRoles)
  rol: ValidRoles;

  @Prop({ required: true })
  @Field(() => User)
  createdBy: string;

  @Prop({ default: InvitationStates.enabled })
  @Field(() => InvitationStates)
  state: InvitationStates;

  @Prop({
    default: () => {
      const expireDate = new Date(Date.now());
      expireDate.setDate(expireDate.getDate() + 1);
      return expireDate;
    },
  })
  @Field(() => Date)
  expiresAt: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => GraphQLJSON, {
    description:
      'Extra useful information for the subsequent registration using the invitation',
    nullable: true,
  })
  @Prop({ type: Object })
  metadata: JSON;

  get expired(): boolean {
    return this.expiresAt.getTime() < Date.now();
  }
}
/**
 * @ignore
 */
export const InvitationSchema = SchemaFactory.createForClass(Invitation);
