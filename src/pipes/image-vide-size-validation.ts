import { PipeTransform, Injectable, HttpException } from '@nestjs/common';

@Injectable()
export class ImageVideoSizeValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File) {
    // "value" is an object containing the file's attributes and metadata

    if (value && value?.mimetype) {
      const isImage = new RegExp(
        /(image|video)\/(png|jpg|jpeg|gif|mp4|wav)$/,
      ).test(value.mimetype);

      if (!isImage) {
        throw new HttpException('Envie uma imagem!', 400);
      }

      const oneKb = 1000;
      const oneMb = oneKb * 1000;
      const validSize = oneMb * 400; // 32Mb

      if (value.size > validSize) {
        throw new HttpException('Foto deve ter pelo menos 32Mb', 400);
      }

      return value; // 400Mb
    }

    return undefined;
  }
}
