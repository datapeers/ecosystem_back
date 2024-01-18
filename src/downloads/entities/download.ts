import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/entities/user.entity';
/**
 * Downloads of table in app
 */
@Schema({ timestamps: true })
@ObjectType()
export class Download {
  @Field(() => ID)
  _id: string;

  @Field(() => String, { description: 'Original name of stored file.' })
  @Prop()
  name: string;

  @Field(() => String, { description: 'Url of stored file.' })
  @Prop()
  url: string;

  @Field(() => Date, {
    description:
      'If set, The date the entity was deleted. A deleted file should not exists in its storage',
    nullable: true,
  })
  @Prop()
  deletedAt: Date;

  @Field(() => User, {
    description: 'If set, Details from user who last updated the entity.',
    nullable: true,
  })
  @Prop()
  updatedBy: string;

  @Field(() => Date, { description: 'Date of entity creation.' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date of last entity update.' })
  updatedAt: Date;
}
/**
 * @ignore
 */
export const DownloadSchema = SchemaFactory.createForClass(Download);
