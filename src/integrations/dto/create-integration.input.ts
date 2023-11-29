import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TypeIntegration } from '../enum/types.enum';

@InputType()
export class CreateIntegrationInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  code: string;

  @IsEnum(TypeIntegration)
  @IsNotEmpty()
  @Field(() => String)
  typeIntegration: TypeIntegration;
}
