import { ArgsType, Field } from '@nestjs/graphql';
import { PageRequest } from './page-request';
import { TableExportFormats } from './table-export-formats.enum';
import { IsNotEmpty } from 'class-validator';
/**
 * @ignore
 */
@ArgsType()
export class DownloadRequestArgs {
  @Field(() => PageRequest)
  @IsNotEmpty()
  request: PageRequest;

  @Field(() => String)
  @IsNotEmpty()
  configId: string;

  @Field(() => TableExportFormats)
  @IsNotEmpty()
  format: TableExportFormats;
}
