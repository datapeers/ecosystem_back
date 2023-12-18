export interface IFileUpload {
  url?: string;
  name: string;
}

export interface IFileUploadExtended extends IFileUpload {
  file?: File;
}
