import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Schema({ timestamps: true })
@ObjectType()
export class User {
  @Field( () => ID )
  _id: string;

  @Field(() => String, { description: "User unique identifier." })
  @Prop({ unique: true, required: true })
  uid: string;

  @Field(() => String, { description: "User full name." })
  @Prop({ default: "" })
  fullName: string;

  @Field(() => String, { description: "Account email/username." })
  @Prop({ unique: true, required: true })
  email: string;

  @Field( () => String, { nullable: true })
  @Prop()
  profileImageUrl?: string;

  @Prop({ type: [String], array: true, enum: ValidRoles, default: [ValidRoles.user] })
  @Field( () => [ String ])
  roles: ValidRoles[];

  @Prop({ type: 'boolean', default: true })
  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => Date, { description: "Date of entity creation."})
  createdAt: Date;

  @Field(() => Date, { description: "Date of last entity update."})
  updatedAt: Date;

  @Field(() => String, { description: "If set, Unique Id of the user who last updated the entity.", nullable: true })
  @Prop()
  updatedBy: string;

  @Field(() => Date, { nullable: true })
  @Prop({ description: "Determines when the user already set its own password." })
  passwordSet?: Date;

  get rolValue(): number {
    const rolValues = this.roles.map(rol => rolValues[rol]);
    return Math.max(...rolValues);
  };
}

export const UserSchema = SchemaFactory.createForClass(User);