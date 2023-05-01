export abstract class FormDocumentService<TEntity extends FormEntity = FormEntity> {
  getDocument: (id: string) => Promise<FormEntity>;
  createDocument: (submission: any) => Promise<FormEntity>;
  updateDocument: (id: string, submission: any) => Promise<FormEntity>;
};

type FormEntity = {
  _id: string;
  item: any;
}