import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
/**
 * sites in dashboard
 */
@Schema({ timestamps: true })
@ObjectType()
export class Site {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ required: true })
  name: string;

  @Field(() => String, {
    description: 'Link to a small image to be used as thumbnail.',
    nullable: true,
  })
  @Prop({ default: '' })
  thumbnail: string;

  @Field(() => String, {
    nullable: true,
  })
  @Prop({ default: '' })
  description: string;

  @Field(() => String, {
    nullable: true,
  })
  @Prop({ default: '' })
  directedTo: string;

  @Field(() => String, {
    nullable: true,
  })
  @Prop({ default: '' })
  methodology: string;

  @Field(() => [String], {
    nullable: true,
  })
  @Prop({ default: [] })
  factors: string[];

  @Field(() => String, {
    nullable: true,
  })
  @Prop({ default: '' })
  results: string;

  // @Field(() => GraphQLJSONObject)
  // @Prop({ type: SchemaTypes.Mixed, required: true })
  // coords: any;

  // @Field(() => [ServicesSiteLink])
  // @Prop({ default: [] })
  // services: ServicesSiteLink[];

  @Field(() => [ContactServiceLink])
  @Prop({ default: [] })
  contacts: ContactServiceLink[];

  @Field(() => Boolean)
  @Prop({ default: false })
  isDeleted: boolean;

  @Field(() => Date, { description: 'Creation date of the entity.' })
  createdAt: Date;

  @Field(() => Date, { description: 'Update date of the entity.' })
  updatedAt: Date;
}
/**
 * @ignore
 */
@Schema()
@ObjectType()
export class ServicesSiteLink {
  @Field(() => String)
  @Prop()
  name: string;

  @Field(() => String)
  @Prop()
  description: string;

  @Field(() => String)
  @Prop()
  email: string;

  @Field(() => String)
  @Prop()
  contact: string;

  // @Field(() => GraphQLJSONObject)
  // @Prop({ type: SchemaTypes.Mixed, required: true })
  // coords: any;
}
/**
 * contact relationship
 */
@Schema()
@ObjectType()
export class ContactServiceLink {
  @Field(() => String)
  @Prop()
  name: string;

  @Field(() => String)
  @Prop()
  others: string;

  @Field(() => String)
  @Prop()
  email: string;

  @Field(() => String)
  @Prop()
  contact: string;

  // @Field(() => GraphQLJSONObject)
  // @Prop({ type: SchemaTypes.Mixed, required: true })
  // coords: any;
}
/**
 * @ignore
 */
export const SiteSchema = SchemaFactory.createForClass(Site);
