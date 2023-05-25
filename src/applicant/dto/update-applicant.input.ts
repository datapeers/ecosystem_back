import { CreateApplicantInput } from './create-applicant.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateApplicantInput extends PartialType(CreateApplicantInput) {
  @Field(() => Int)
  id: number;
}
