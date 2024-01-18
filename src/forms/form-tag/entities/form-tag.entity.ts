import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
/**
 * form tags dynamic
 */
@Schema({ timestamps: true })
@ObjectType()
export class FormTag {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop()
  name: string;

  @Field(() => Date, {
    description: 'If set, The date the entity was deleted.',
    nullable: true,
  })
  @Prop()
  deletedAt: Date;

  @Field(() => Date, { description: 'Date of entity creation.' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date of last entity update.' })
  updatedAt: Date;

  @Field(() => User, {
    description: 'If set, Details from user who last updated the entity.',
    nullable: true,
  })
  @Prop()
  updatedBy: string;
}
/**
 * @ignore
 */
export const FormTagSchema = SchemaFactory.createForClass(FormTag);
