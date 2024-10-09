import { HttpException, Injectable } from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import * as uuid from 'uuid';

@Injectable()
export class FileUploadService {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  s3 = new S3({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_DEFAULT_REAGION,
  });

  async uploadFile(file: Express.Multer.File) {
    const { originalname } = file;

    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype,
    );
  }

  async deleteFile(key: string) {
    return await this.s3_delete_file(this.AWS_S3_BUCKET, key);
  }

  private async s3_upload(
    file: Express.Multer.File['buffer'],
    bucket: string,
    name: string,
    mimetype: string,
  ) {
    const filteredName = name.replace(/\s+/g, '');
    const key = String(`${uuid.v4()}_${filteredName}`);

    const params = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
    });

    try {
      const s3Response = await this.s3.send(params);

      return {
        Key: key,
        Location: `${process.env.CLOUD_FRONT}/${key}`,
      };
    } catch (e) {
      console.log(e);
      throw new HttpException('Error uploading file', 500);
    }
  }

  private async s3_delete_file(bucket: string, key: string) {
    const params = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    try {
      const s3Response = await this.s3.send(params);

      return s3Response;
    } catch (e) {
      console.log(e);
      throw new HttpException('Error uploading file', 500);
    }
  }
}
