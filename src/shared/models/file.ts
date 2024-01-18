/**
 * @ignore
 */
export interface IFileUpload {
  url?: string;
  name: string;
}
/**
 * @ignore
 */
export interface IFileUploadExtended extends IFileUpload {
  file?: File;
}
