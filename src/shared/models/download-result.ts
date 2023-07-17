import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DownloadResult {
  @Field(() => String)
  url: string;
}