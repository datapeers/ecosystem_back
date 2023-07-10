import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";

@Schema()
@InputType()
@ObjectType()
export class TableJoin {
  @IsString()
  @Field()
  @Prop()
  name: string;

  @IsString()
  @Field()
  @Prop()
  key: string;

  @IsString()
  @Field()
  @Prop()
  form: string;
}

export const TableJoinSchema = SchemaFactory.createForClass(TableJoin);