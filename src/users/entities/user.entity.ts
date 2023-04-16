import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Schema({ timestamps: true })
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
  roles: ValidRoles[];

  @Prop({ type: 'boolean', default: true })
  @Field( () => Boolean )
  isActive: boolean;

  @Field( () => Date )
  createdAt: Date;

  @Field( () => Date )
  updatedAt: Date;

  @Prop({ default: "" })
  updatedBy: string;

  @Prop({ default: true })
  @Field( () => Boolean )
  passwordSet: boolean;

  get rolValue(): number {
    const rolValues = this.roles.map(rol => rolValues[rol]);
    return Math.max(...rolValues);
  };

  @Field( () => String, { nullable: true })
  @Prop({ default: "" })
  profileImageUrl?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);