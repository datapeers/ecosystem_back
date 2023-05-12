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
  private readonly publicConfig: S3ClientConfig;
  private readonly defaultBucketName: string;
  constructor(private readonly configService: ConfigService<AppConfiguration>) {
    const region = this.configService.get('awsS3Region');
    this.defaultBucketName = this.configService.get('awsS3BucketName');
    this.config = {
      region,
      endpoint: this.configService.get('awsS3Uri'),
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

  async createPresignedUrl(key: string, publicFile?: any): Promise<string> {
    const client = new S3Client(publicFile ? this.publicConfig : this.config);
    const config = {
      Bucket: this.defaultBucketName,
      Key: key,
    };
    const command = new PutObjectCommand(config);
    try {
      return await getSignedUrl(client, command, { expiresIn: 60 * 3 });
    } catch(error) {
      console.error(error);
      throw new InternalServerErrorException("Failed to create presigned Url for PUT request");
    }
  }

  async getPresignedUrl(key: string, publicFile?: any) {
    const client = new S3Client(publicFile ? this.publicConfig : this.config);
    const config = {
      Bucket: this.defaultBucketName,
      Key: key,
    };
    const command = new GetObjectCommand(config);
    try {
      return await getSignedUrl(client, command, { expiresIn: 60 * 60 * 24 });
    } catch(error) {
      console.error(error);
      throw new InternalServerErrorException("Failed to create presigned Url for GET request");
    }
  }
}
