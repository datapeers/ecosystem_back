export abstract class StorageService {
  public abstract createPresignedUrl(
    key: string,
    publicFile?: any,
  ): Promise<string>;
  public abstract getPresignedUrl(
    key: string,
    publicFile?: any,
  ): Promise<string>;
}
