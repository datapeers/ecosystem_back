import { Body, Controller, Param, Post } from '@nestjs/common';
import { StorageService } from './models/storage-service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  async create(@Body() file: any): Promise<any> {
    const result = await this.storageService.createPresignedUrl(file.name);
    return { url: result };
  }
}
