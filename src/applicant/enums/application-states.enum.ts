import { registerEnumType } from '@nestjs/graphql';

/**
 * applicant states
 */
export enum ApplicationStates {
  preregistered = 'preregistered',
  enrolled = 'enrolled',
  selected = 'selected',
}

registerEnumType(ApplicationStates, {
  name: 'ApplicationStates',
});
