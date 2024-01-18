import { Field, ObjectType } from '@nestjs/graphql';
import { UpdateWriteOpResult } from 'mongoose';
/**
 * @ignore
 */
@ObjectType()
export class UpdateResultPayload {
  @Field(() => Boolean, {
    description:
      'Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined',
  })
  acknowledged: boolean;

  @Field(() => Number, {
    nullable: true,
    description: 'The number of documents that matched the filter',
  })
  matchedCount: number;

  @Field(() => Number, {
    nullable: true,
    description: 'The number of documents that were modified',
  })
  modifiedCount: number;

  @Field(() => Number, {
    nullable: true,
    description: 'The number of documents that were upserted',
  })
  upsertedCount: number;

  @Field(() => String, {
    nullable: true,
    description:
      'The identifier of the inserted document if an upsert took place',
  })
  upsertedId: string;

  public static fromPayload(
    updateResult: UpdateWriteOpResult,
  ): UpdateResultPayload {
    let payload = new UpdateResultPayload();
    Object.assign(payload, updateResult);
    payload.upsertedId = updateResult.upsertedId?.toString();
    return payload;
  }
}
