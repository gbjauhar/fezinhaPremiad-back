import { PipeTransform, Injectable, HttpException } from '@nestjs/common';

@Injectable()
export class ImageSizeValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File) {
    // "value" is an object containing the file's attributes and metadata

    if (value && value?.mimetype) {
      const isImage = new RegExp(/image\/(png|jpg|jpeg|gif)$/).test(
        value.mimetype,
      );

      if (!isImage) {
        throw new HttpException('Envie uma imagem!', 400);
      }

      const oneKb = 1000;
      const oneMb = oneKb * 1000;
      const validSize = oneMb * 32; // 32Mb

      if (value.size > validSize) {
        throw new HttpException('Foto deve ter pelo menos 32Mb', 400);
      }

      return value; // 32Mb
    }

    return undefined;
  }
}
