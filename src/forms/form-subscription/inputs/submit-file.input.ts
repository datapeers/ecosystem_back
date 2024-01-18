import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
/**
 * graphql args input
 */
@InputType()
export class SubmitFileInput {
  @Field(() => String, { description: 'Form id.' })
  @IsString()
  form: string;

  @Field(() => String, { description: 'Submitted document id.' })
  @IsString()
  doc: string;

  @Field(() => String, { description: 'Url of the submitted file.' })
  @IsNotEmpty()
  fileUrl: string;

  @Field(() => String, {
    description: 'Key of the file input that was submitted.',
  })
  @IsString()
  fileKey: string;
}
