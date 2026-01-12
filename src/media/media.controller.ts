import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'item', maxCount: 1 },
      { name: 'restaurant', maxCount: 1 },
    ]),
  )
  async uploadImage(
    @UploadedFiles()
    files: {
      item?: Express.Multer.File[];
      restaurant?: Express.Multer.File[];
    },
  ) {
    const itemFile = files.item?.[0]; 
    const restaurantFile = files.restaurant?.[0];

    const itemUpload = itemFile
      ? await this.mediaService.uploadFile(itemFile)
      : null;

    const restaurantUpload = restaurantFile
      ? await this.mediaService.uploadFile(restaurantFile)
      : null;

    return {
      item: itemUpload,
      restaurant: restaurantUpload,
    };
  }
}
