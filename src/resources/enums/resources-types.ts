import { registerEnumType } from '@nestjs/graphql';
/**
 * resources types
 */
export enum ResourceType {
  downloadable = 'downloadable',
  task = 'task',
  form = 'form',
}

registerEnumType(ResourceType, {
  name: 'ResourceType',
});
