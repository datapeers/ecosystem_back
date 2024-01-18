import { Resource } from 'src/resources/entities/resource.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
/**
 * @ignore
 */
interface ISearchResult {
  label: string;
  type: 'batch' | 'content' | 'resourceContent' | 'resourceSprint';
  metadata: Record<string, any>;
}
/**
 * @ignore
 */
export class searchResult {
  label: string;
  type: 'batch' | 'content' | 'resourceContent' | 'resourceSprint';
  metadata: Record<string, any>;

  constructor(item: ISearchResult) {
    return Object.assign(this, item);
  }
}
/**
 * @ignore
 */
export function searchResource(
  resources: Resource[],
  searchValue,
  batch: string,
  sprint: string,
  content?: string,
): searchResult[] {
  let ans: searchResult[] = [];
  for (const resource of resources) {
    if (resource.name.match(new RegExp(searchValue, 'i')) !== null)
      ans.push(
        new searchResult({
          label: resource.name,
          type: content ? 'resourceContent' : 'resourceSprint',
          metadata: { _id: resource._id, batch, content, sprint, tag: 'Tarea' },
        }),
      );
  }
  return ans;
}
/**
 * @ignore
 */
@ObjectType()
export class SearchInBatchOutput {
  @Field(() => [GraphQLJSON])
  ansPhases: JSON[];

  @Field(() => [GraphQLJSON])
  ansContent: JSON[];

  @Field(() => [GraphQLJSON])
  ansResource: JSON[];
}
