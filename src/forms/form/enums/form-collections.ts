import { registerEnumType } from '@nestjs/graphql';
/**
 * target collection for answered forms
 */
export enum FormCollections {
  announcements = 'announcements',
  resources = 'resources',
  survey = 'survey',
  entrepreneurs = 'entrepreneurs',
  startups = 'startups',
  evaluations = 'evaluations',
  experts = 'experts',
  businesses = 'businesses',
}

registerEnumType(FormCollections, {
  name: 'FormCollections',
});
