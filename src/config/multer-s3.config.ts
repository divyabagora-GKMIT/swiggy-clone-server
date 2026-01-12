import multerS3 from 'multer-s3';
import { v4 as uuid } from 'uuid';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { s3 } from './s3.config';

export const multerS3Options: MulterOptions = {
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET!,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      const ext = file.originalname.split('.').pop();
      cb(null, `${uuid()}.${ext}`);
    },
  }),
};
