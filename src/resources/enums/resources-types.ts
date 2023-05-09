import { registerEnumType } from '@nestjs/graphql';

export enum ResourceType {
  downloadable = 'downloadable',
  task = 'task',
  form = 'form',
}

registerEnumType(ResourceType, {
  name: 'ResourceType',
});
