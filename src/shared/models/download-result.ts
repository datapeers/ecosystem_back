import { Field, ObjectType } from '@nestjs/graphql';
/**
 * @ignore
 */
@ObjectType()
export class DownloadResult {
  @Field(() => String)
  url: string;
}
