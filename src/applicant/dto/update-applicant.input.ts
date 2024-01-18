import { CreateApplicantInput } from './create-applicant.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

/**
 * graphql input scheme
 */
@InputType()
export class UpdateApplicantInput extends PartialType(CreateApplicantInput) {
  @Field(() => Int)
  id: number;
}
