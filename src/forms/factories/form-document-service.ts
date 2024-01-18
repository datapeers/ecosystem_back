import { FormFileSubmission } from './form-file-submission';
/**
 * @ignore
 */
export abstract class FormDocumentService<
  TEntity extends FormEntity = FormEntity,
> {
  getDocument: (id: string) => Promise<TEntity>;
  createDocument: (submission: any, context: any) => Promise<TEntity>;
  updateDocument: (
    id: string,
    submission: any,
    context: any,
  ) => Promise<TEntity>;
  uploadFile?: (
    id: string,
    document: FormFileSubmission,
  ) => Promise<FormFileSubmission[]>;
}
/**
 * @ignore
 */
type FormEntity = {
  _id: string;
  item: any;
  documents?: FormFileSubmission[];
};
