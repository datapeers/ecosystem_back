import { Body, Controller, Param, Post, Get, Query } from '@nestjs/common';
import { StorageService } from './models/storage-service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  async create(@Body() file: any): Promise<any> {
    const result = await this.storageService.createPresignedUrl(file.name);
    return { url: result };
  }

  @Get()
  async get(@Query() query): Promise<any> {
    const result = await this.storageService.getPresignedUrl(query.key);
    return { url: result };
  }
}
