import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageService } from '../models/storage-service';
import { AppConfiguration } from 'config/app.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService implements StorageService {
  private readonly config: S3ClientConfig;
  private readonly S3Uri: string;
  private readonly publicConfig: S3ClientConfig;
  private readonly defaultBucketName: string;
  private readonly tempBucketName: string;

  constructor(private readonly configService: ConfigService<AppConfiguration>) {
    const region = this.configService.get('awsS3Region');
    this.defaultBucketName = this.configService.get('awsS3BucketName');
    this.tempBucketName = this.configService.get('awsS3TempBucketName');
    this.S3Uri = this.configService.get('awsS3Uri');
    this.config = {
      region,
      endpoint: this.S3Uri,
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.get('awsS3Key'),
        secretAccessKey: this.configService.get('awsS3Access'),
      },
    };
    this.publicConfig = {
      region,
      endpoint: this.configService.get('awsS3PublicUri'),
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.get('awsS3Key'),
        secretAccessKey: this.configService.get('awsS3Access'),
      },
    };
  }
  /**
   * get rute of file location
   */
  private getFileLocation(bucketName: string, fileKey: string): string {
    return `${this.configService.get(
      'awsS3PublicUri',
    )}/${bucketName}/${fileKey}`;
  }

  /**
   * create url to download file
   */
  async createPresignedUrl(key: string, publicFile?: boolean): Promise<string> {
    const client = new S3Client(publicFile ? this.publicConfig : this.config);
    const config = {
      Bucket: this.defaultBucketName,
      Key: key,
    };
    const command = new PutObjectCommand(config);
    try {
      return await getSignedUrl(client, command, { expiresIn: 60 * 3 });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to create presigned Url for PUT request',
      );
    }
  }

  /**
   * get url to download file
   */
  async getPresignedUrl(key: string, publicFile?: boolean) {
    const client = new S3Client(publicFile ? this.publicConfig : this.config);
    const config = {
      Bucket: this.defaultBucketName,
      Key: key,
    };
    const command = new GetObjectCommand(config);
    try {
      return await getSignedUrl(client, command, { expiresIn: 60 * 60 * 24 });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to create presigned Url for GET request',
      );
    }
  }

  /**
   * upload file
   */
  async uploadTemporaryFile(key: string, data: Buffer) {
    const client = new S3Client(this.publicConfig);
    const command = new PutObjectCommand({
      Bucket: 'files',
      Key: key,
      Body: data,
    });
    try {
      const result = await client.send(command);
      return this.getFileLocation('files', key);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Failed to create presigned Url for PUT request',
      );
    }
  }
}
