import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ValidRoles, rolValues } from 'src/auth/enums/valid-roles.enum';
import { SchemaTypes } from 'mongoose';
import { Rol } from 'src/rol/entities/rol.entity';
import { GraphQLJSONObject } from 'graphql-scalars';
/**
 * users docs
 */
@Schema({ timestamps: true })
@ObjectType()
export class User {
  @Field(() => ID)
  _id: string;

  @Field(() => String, { description: 'User unique identifier.' })
  @Prop({ unique: true, required: true })
  uid: string;

  @Field(() => String, { description: 'User full name.' })
  @Prop({ default: '' })
  fullName: string;

  @Field(() => String, { description: 'Account email/username.' })
  @Prop({ unique: true, required: true })
  email: string;

  @Field(() => String, { nullable: true })
  @Prop()
  profileImageUrl?: string;

  // @Prop({
  //   type: [String],
  //   array: true,
  //   enum: ValidRoles,
  //   default: [ValidRoles.user],
  // })
  // @Field(() => [String])
  // roles: ValidRoles[];

  @Field(() => Rol)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Rol' })
  rol: string;

  @Prop({ type: 'boolean', default: true })
  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => Date, { description: 'Date of entity creation.' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date of last entity update.' })
  updatedAt: Date;

  @Field(() => String, {
    description: 'If set, Unique Id of the user who last updated the entity.',
    nullable: true,
  })
  @Prop()
  updatedBy: string;

  @Field(() => Date, { nullable: true })
  @Prop({
    description: 'Determines when the user already set its own password.',
  })
  passwordSet?: Date;

  @Field(() => Boolean, { nullable: true })
  @Prop({
    description: 'Determines if user its registered with google',
  })
  googleIn?: Boolean;

  @Field(() => GraphQLJSONObject, { nullable: true, defaultValue: {} })
  @Prop({ type: SchemaTypes.Mixed })
  relationsAssign: any;

  @Field(() => [String], { nullable: true })
  @Prop({ default: [] })
  permissions: string[];
}

/**
 * @ignore
 */
export const UserSchema = SchemaFactory.createForClass(User);
