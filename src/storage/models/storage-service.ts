export abstract class StorageService {
  public abstract createPresignedUrl(key: string): Promise<string>;
  public abstract getPresignedUrl(key: string): Promise<string>;
}
