import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { getSignedUrl, } from "@aws-sdk/s3-request-presigner";
import { StorageService } from '../models/storage-service';
import { AppConfiguration } from 'config/app.config';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AwsService implements StorageService {
  private readonly config: S3ClientConfig;
  private readonly defaultBucketName: string;
  constructor(
    private readonly configService: ConfigService<AppConfiguration>
  ) {
    const endpoint = this.configService.get("awsS3Uri");
    this.defaultBucketName = this.configService.get("awsS3BucketName");
    const region = this.configService.get("awsS3Region");
    this.config = {
      region,
      endpoint,
      forcePathStyle: true,
    };
  }

  async createPresignedUrl(key: string): Promise<string> {
    const client = new S3Client(this.config);
    const config = { Bucket: this.defaultBucketName, Key: key }
    const command = new PutObjectCommand(config);
    return await getSignedUrl(client, command, { expiresIn: 3600 });
  };
};

