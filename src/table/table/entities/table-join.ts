import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsOptional, IsString } from "class-validator";
import GraphQLJSON from "graphql-type-json";
import { TableColumn } from "src/shared/models/table-column";

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

  @Field(() => GraphQLJSON)
  @IsOptional()
  @Prop({ default: [] })
  extraColumns: TableColumn[];
}

export const TableJoinSchema = SchemaFactory.createForClass(TableJoin);