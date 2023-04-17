export abstract class StorageService {
  public abstract createPresignedUrl(key: string): Promise<string>;
}