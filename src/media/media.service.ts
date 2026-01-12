import { Injectable } from '@nestjs/common';
import {  Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
@Injectable()
export class MediaService {
  private readonly s3: AWS.S3;
  private readonly AWS_S3_BUCKET: string;
  constructor(private readonly configService: ConfigService) {
    this.AWS_S3_BUCKET = this.configService.getOrThrow<string>('S3_BUCKET_NAME');
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow<string>(
        'AWS_SECRET_ACCESS_KEY',
      ),
      region: this.configService.get<string>('AWS_REGION', 'ap-south-1'),
    });
  }
  async uploadFile(file) {
    const { originalname } = file;

    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype,
    );
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    try {
      let s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }
}
