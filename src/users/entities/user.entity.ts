import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Schema()
@ObjectType()
export class User {
  @Field( () => ID )
  _id: string;

  @Prop({ unique: true, required: true })
  @Field( () => String )
  uid: string;

  @Prop({ default: "" })
  @Field( () => String)
  fullName: string;

  @Prop({ unique: true, required: true })
  @Field( () => String )
  email: string;

  @Prop({ type: [String], array: true, enum: ValidRoles, default: [ValidRoles.user] })
  @Field( () => [ String ])
  roles: string[];

  @Prop({ type: 'boolean', default: true })
  @Field( () => Boolean )
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);