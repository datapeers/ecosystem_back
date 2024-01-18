import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
/**
 * @ignore
 */
@Schema()
@ObjectType()
export class FormFileSubmission {
  @Field(() => String, { description: 'File url.' })
  @Prop({ required: true })
  url: string;

  @Field(() => String, { description: 'Form key for the file.' })
  @Prop({ required: true })
  key: string;
}
