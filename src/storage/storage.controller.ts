import { Body, Controller, Param, Post, Get, Query } from '@nestjs/common';
import { StorageService } from './models/storage-service';
/**
 * upload files endpoints
 */
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  async create(@Body() body: any): Promise<any> {
    const result = await this.storageService.createPresignedUrl(
      body.name,
      body.publicFile,
    );
    return { url: result };
  }

  @Get()
  async get(@Query() query): Promise<any> {
    const result = await this.storageService.getPresignedUrl(query.key);
    return { url: result };
  }
}
