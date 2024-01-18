import { Controller } from '@nestjs/common';
import { DownloadsService } from './downloads.service';
/**
 * @ignore
 */
@Controller()
export class DownloadsController {
  constructor(private readonly downloadsService: DownloadsService) {}
}
